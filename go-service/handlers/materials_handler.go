package handlers

import (
	"encoding/json"
	"net/http"

	"example.com/go-service/services"
)

// MaterialsEstimationHandler handles materials estimation HTTP requests
type MaterialsEstimationHandler struct {
	service *services.MaterialsEstimationService
}

// NewMaterialsEstimationHandler creates a new materials estimation handler
func NewMaterialsEstimationHandler(service *services.MaterialsEstimationService) *MaterialsEstimationHandler {
	return &MaterialsEstimationHandler{
		service: service,
	}
}

// EstimateByBuildingTypeRequest represents request for building type estimation
type EstimateByBuildingTypeRequest struct {
	BuildingType string `json:"buildingType"` // "3bedroom", "2bedroom", "4bedroom"
	Floors       int    `json:"floors"`       // Number of floors
}

// EstimateByAreaRequest represents request for area-based estimation
type EstimateByAreaRequest struct {
	Area            float64 `json:"area"`            // Square meters
	Floors          int     `json:"floors"`          // Number of floors
	IncludeFinishes bool    `json:"includeFinishes"` // Include paints, tiles, etc.
}

// EstimateByCementRequest represents request for cement-based estimation
type EstimateByCementRequest struct {
	CementBags float64 `json:"cementBags"` // Number of cement bags
	MixType    string  `json:"mixType"`    // "foundation", "structural", "screed", "mortar"
}

// EstimateWithAIRequest represents request for AI-powered estimation
type EstimateWithAIRequest struct {
	ProjectDescription string  `json:"projectDescription"` // Natural language description
	BuildingType       string  `json:"buildingType,omitempty"`
	Area               float64 `json:"area,omitempty"`
	Floors             int     `json:"floors,omitempty"`
	AdditionalInfo     string  `json:"additionalInfo,omitempty"`
}

// EstimateByBuildingType handles POST /api/materials/estimate/building
func (h *MaterialsEstimationHandler) EstimateByBuildingType(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req EstimateByBuildingTypeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.Floors <= 0 {
		req.Floors = 1
	}

	buildingType := services.BuildingType(req.BuildingType)
	estimate, err := h.service.EstimateByBuildingType(buildingType, req.Floors)

	if err != nil {
		http.Error(w, "Failed to estimate materials: "+err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"estimate": estimate,
	})
}

// EstimateByArea handles POST /api/materials/estimate/area
func (h *MaterialsEstimationHandler) EstimateByArea(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req EstimateByAreaRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.Floors <= 0 {
		req.Floors = 1
	}

	estimate, err := h.service.EstimateByArea(req.Area, req.Floors, req.IncludeFinishes)

	if err != nil {
		http.Error(w, "Failed to estimate materials: "+err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"estimate": estimate,
	})
}

// EstimateByCement handles POST /api/materials/estimate/cement
func (h *MaterialsEstimationHandler) EstimateByCement(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req EstimateByCementRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.MixType == "" {
		req.MixType = "structural"
	}

	estimate, err := h.service.EstimateByCementQuantity(req.CementBags, req.MixType)

	if err != nil {
		http.Error(w, "Failed to estimate materials: "+err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"estimate": estimate,
	})
}

// GetPrices handles GET /api/materials/prices
func (h *MaterialsEstimationHandler) GetPrices(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	prices := h.service.GetAllPrices()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"prices":  prices,
	})
}

// UpdatePrice handles PUT /api/materials/prices/:material
func (h *MaterialsEstimationHandler) UpdatePrice(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract material from URL path
	material := r.URL.Query().Get("material")
	if material == "" {
		http.Error(w, "Material parameter required", http.StatusBadRequest)
		return
	}

	var req struct {
		Price float64 `json:"price"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	err := h.service.UpdateMaterialPrice(services.MaterialType(material), req.Price)
	if err != nil {
		http.Error(w, "Failed to update price: "+err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Price updated successfully",
	})
}

// EstimateWithAI handles POST /api/materials/estimate/ai - AI-powered natural language estimation
func (h *MaterialsEstimationHandler) EstimateWithAI(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req EstimateWithAIRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.ProjectDescription == "" {
		http.Error(w, "Project description is required", http.StatusBadRequest)
		return
	}

	estimate, err := h.service.EstimateWithAI(
		req.ProjectDescription,
		req.BuildingType,
		req.Area,
		req.Floors,
		req.AdditionalInfo,
	)

	if err != nil {
		// If AI fails, try to fall back to manual estimation if enough info is provided
		if req.Area > 0 {
			estimate, err = h.service.EstimateByArea(req.Area, req.Floors, true)
			if err == nil {
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(map[string]interface{}{
					"success":  true,
					"estimate": estimate,
					"note":     "AI estimation unavailable, used manual calculation",
				})
				return
			}
		}

		http.Error(w, "Failed to estimate materials: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"estimate": estimate,
		"method":   "AI-powered",
	})
}

// GetExamples handles GET /api/materials/examples
func (h *MaterialsEstimationHandler) GetExamples(w http.ResponseWriter, r *http.Request) {
	examples := map[string]interface{}{
		"description": "Materials Estimation API - Calculate construction materials and costs",
		"endpoints": map[string]interface{}{
			"estimate_by_building": map[string]interface{}{
				"method":      "POST",
				"path":        "/api/materials/estimate/building",
				"description": "Estimate materials for standard building types",
				"example": EstimateByBuildingTypeRequest{
					BuildingType: "3bedroom",
					Floors:       1,
				},
				"supported_types": []string{"2bedroom", "3bedroom", "4bedroom"},
			},
			"estimate_by_area": map[string]interface{}{
				"method":      "POST",
				"path":        "/api/materials/estimate/area",
				"description": "Estimate materials by floor area",
				"example": EstimateByAreaRequest{
					Area:            120.0,
					Floors:          1,
					IncludeFinishes: true,
				},
			},
			"estimate_by_cement": map[string]interface{}{
				"method":      "POST",
				"path":        "/api/materials/estimate/cement",
				"description": "Calculate other materials based on cement quantity",
				"example": EstimateByCementRequest{
					CementBags: 100.0,
					MixType:    "structural",
				},
				"supported_mixes": []string{"foundation", "structural", "screed", "mortar"},
			},
			"estimate_with_ai": map[string]interface{}{
				"method":      "POST",
				"path":        "/api/materials/estimate/ai",
				"description": "AI-powered materials estimation using natural language",
				"example": EstimateWithAIRequest{
					ProjectDescription: "I want to build a modern 3-bedroom house with a large living room and kitchen",
					Area:               150.0,
					Floors:             1,
					AdditionalInfo:     "Include tiles and paint for finishes",
				},
				"note": "Requires AI_API_KEY environment variable to be set",
			},
			"get_prices": map[string]interface{}{
				"method":      "GET",
				"path":        "/api/materials/prices",
				"description": "Get current material prices",
			},
			"update_price": map[string]interface{}{
				"method":      "PUT",
				"path":        "/api/materials/prices?material=cement",
				"description": "Update material price",
				"example": map[string]interface{}{
					"price": 850.0,
				},
			},
		},
		"use_cases": map[string]string{
			"customer_inquiry": "Customer calls asking: 'I need 50 bags of cement, what else do I need?'",
			"building_plan":    "Customer: 'I'm building a 3-bedroom house, what will it cost?'",
			"area_based":       "Customer: 'I have 150 sqm floor area, what materials do I need?'",
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(examples)
}
