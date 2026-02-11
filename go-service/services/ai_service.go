package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// AIService handles interactions with AI APIs for intelligent estimation
type AIService struct {
	apiKey     string
	apiURL     string // Base URL for the AI API
	model      string
	httpClient *http.Client
}

// NewAIService creates a new AI service
func NewAIService(apiKey, apiURL, model string) *AIService {
	if apiURL == "" {
		apiURL = "https://api.openai.com/v1" // Default to OpenAI
	}
	if model == "" {
		model = "gpt-4" // Default model
	}

	return &AIService{
		apiKey: apiKey,
		apiURL: apiURL,
		model:  model,
		httpClient: &http.Client{
			Timeout: 60 * time.Second,
		},
	}
}

// EstimateRequest represents a materials estimation request
type EstimateRequest struct {
	ProjectDescription string  `json:"projectDescription"`
	BuildingType       string  `json:"buildingType,omitempty"`
	Area               float64 `json:"area,omitempty"`
	Floors             int     `json:"floors,omitempty"`
	AdditionalInfo     string  `json:"additionalInfo,omitempty"`
}

// AIEstimateResponse represents the AI's estimation response
type AIEstimateResponse struct {
	CementBags      float64            `json:"cementBags"`
	SandTonnes      float64            `json:"sandTonnes"`
	BallastTonnes   float64            `json:"ballastTonnes"`
	OtherMaterials  map[string]float64 `json:"otherMaterials"`
	EstimatedCost   float64            `json:"estimatedCost"`
	Recommendations []string           `json:"recommendations"`
	Reasoning       string             `json:"reasoning"`
	Confidence      string             `json:"confidence"` // "high", "medium", "low"
}

// EstimateWithAI uses AI to provide intelligent materials estimation
func (s *AIService) EstimateWithAI(req EstimateRequest) (*AIEstimateResponse, error) {
	if s.apiKey == "" {
		return nil, fmt.Errorf("AI API key not configured")
	}

	// Build the prompt
	prompt := s.buildEstimationPrompt(req)

	// Call AI API
	responseText, err := s.callAI(prompt)
	if err != nil {
		return nil, err
	}

	// Parse the AI response
	estimate, err := s.parseAIResponse(responseText)
	if err != nil {
		return nil, fmt.Errorf("failed to parse AI response: %w", err)
	}

	return estimate, nil
}

// buildEstimationPrompt creates a detailed prompt for the AI
func (s *AIService) buildEstimationPrompt(req EstimateRequest) string {
	prompt := fmt.Sprintf(`You are an expert construction materials estimator in Kenya. Provide a detailed materials estimate.

Project Information:
%s`, req.ProjectDescription)

	if req.BuildingType != "" {
		prompt += fmt.Sprintf("\nBuilding Type: %s", req.BuildingType)
	}
	if req.Area > 0 {
		prompt += fmt.Sprintf("\nFloor Area: %.1f square meters", req.Area)
	}
	if req.Floors > 0 {
		prompt += fmt.Sprintf("\nNumber of Floors: %d", req.Floors)
	}
	if req.AdditionalInfo != "" {
		prompt += fmt.Sprintf("\nAdditional Information: %s", req.AdditionalInfo)
	}

	prompt += `

Please provide a comprehensive materials estimate including:
1. Cement (50kg bags)
2. Sand (tonnes)
3. Ballast (tonnes)
4. Other key materials (rebar, timber, roofing, etc.)
5. Estimated total cost in Kenyan Shillings
6. Practical recommendations
7. Your reasoning and confidence level

Respond ONLY with valid JSON in this exact format:
{
  "cementBags": <number>,
  "sandTonnes": <number>,
  "ballastTonnes": <number>,
  "otherMaterials": {
    "rebar_kg": <number>,
    "timber_m3": <number>,
    "roofing_sheets": <number>,
    "paint_20L": <number>
  },
  "estimatedCost": <number>,
  "recommendations": ["recommendation1", "recommendation2", "..."],
  "reasoning": "Brief explanation of the estimate",
  "confidence": "high|medium|low"
}`

	return prompt
}

// callAI makes a request to the AI API
func (s *AIService) callAI(prompt string) (string, error) {
	// Prepare request body
	requestBody := map[string]interface{}{
		"model": s.model,
		"messages": []map[string]string{
			{
				"role":    "system",
				"content": "You are an expert construction materials estimator. Always respond with valid JSON only, no markdown formatting.",
			},
			{
				"role":    "user",
				"content": prompt,
			},
		},
		"temperature": 0.3, // Lower temperature for more consistent outputs
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	// Make request
	req, err := http.NewRequest("POST", s.apiURL+"/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.apiKey)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to call AI API: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("AI API returned status %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	var result struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return "", fmt.Errorf("failed to parse AI response: %w", err)
	}

	if len(result.Choices) == 0 {
		return "", fmt.Errorf("no response from AI")
	}

	return result.Choices[0].Message.Content, nil
}

// parseAIResponse parses the AI's JSON response
func (s *AIService) parseAIResponse(responseText string) (*AIEstimateResponse, error) {
	// Clean the response (remove markdown code blocks if present)
	responseText = cleanJSON(responseText)

	var estimate AIEstimateResponse
	if err := json.Unmarshal([]byte(responseText), &estimate); err != nil {
		return nil, err
	}

	return &estimate, nil
}

// cleanJSON removes markdown code blocks and extra whitespace
func cleanJSON(text string) string {
	// Remove ```json and ```
	if len(text) > 7 && text[:7] == "```json" {
		text = text[7:]
	}
	if len(text) > 3 && text[:3] == "```" {
		text = text[3:]
	}
	if len(text) > 3 && text[len(text)-3:] == "```" {
		text = text[:len(text)-3]
	}
	return string(bytes.TrimSpace([]byte(text)))
}

// IsConfigured checks if the AI service has an API key
func (s *AIService) IsConfigured() bool {
	return s.apiKey != ""
}

// AnalyzeBuildingPlans analyzes building plans and provides smart recommendations
func (s *AIService) AnalyzeBuildingPlans(planDescription string) (string, error) {
	if s.apiKey == "" {
		return "", fmt.Errorf("AI API key not configured")
	}

	prompt := fmt.Sprintf(`Analyze this building plan and provide insights:

%s

Provide:
1. Estimated materials needed
2. Construction phases
3. Cost optimization tips
4. Potential challenges
5. Timeline estimate`, planDescription)

	return s.callAI(prompt)
}
