package services

import (
	"fmt"
	"math"
)

// BuildingType represents different types of construction projects
type BuildingType string

const (
	ThreeBedroom   BuildingType = "3bedroom"
	TwoBedroom     BuildingType = "2bedroom"
	FourBedroom    BuildingType = "4bedroom"
	SingleStory    BuildingType = "single_story"
	DoubleStory    BuildingType = "double_story"
	Commercial     BuildingType = "commercial"
	CustomBuilding BuildingType = "custom"
)

// MaterialType represents different construction materials
type MaterialType string

const (
	Cement  MaterialType = "cement"
	Sand    MaterialType = "sand"
	Ballast MaterialType = "ballast"
	Stones  MaterialType = "stones"
	Rebar   MaterialType = "rebar"
	Timber  MaterialType = "timber"
	Roofing MaterialType = "roofing"
	Paint   MaterialType = "paint"
	Tiles   MaterialType = "tiles"
	Bricks  MaterialType = "bricks"
)

// MaterialUnit represents the unit of measurement
type MaterialUnit string

const (
	Bags         MaterialUnit = "bags"
	CubicMeters  MaterialUnit = "m3"
	Tonnes       MaterialUnit = "tonnes"
	Kilograms    MaterialUnit = "kg"
	Pieces       MaterialUnit = "pieces"
	Liters       MaterialUnit = "liters"
	SquareMeters MaterialUnit = "m2"
)

// Material represents a construction material with quantity and cost
type Material struct {
	Name        string       `json:"name"`
	Type        MaterialType `json:"type"`
	Quantity    float64      `json:"quantity"`
	Unit        MaterialUnit `json:"unit"`
	UnitPrice   float64      `json:"unitPrice"`
	TotalPrice  float64      `json:"totalPrice"`
	Description string       `json:"description"`
}

// MaterialEstimate represents a complete materials estimate
type MaterialEstimate struct {
	ProjectType     string            `json:"projectType"`
	BuildingArea    float64           `json:"buildingArea"` // in square meters
	Materials       []Material        `json:"materials"`
	TotalCost       float64           `json:"totalCost"`
	LaborCost       float64           `json:"laborCost"`
	GrandTotal      float64           `json:"grandTotal"`
	EstimatedDays   int               `json:"estimatedDays"`
	Recommendations []string          `json:"recommendations"`
	Ratios          map[string]string `json:"ratios"`
}

// MaterialsEstimationService handles construction materials calculations
type MaterialsEstimationService struct {
	// Material price database (in a real app, this would come from DB)
	prices    map[MaterialType]float64
	aiService *AIService
	useAI     bool
}

// NewMaterialsEstimationService creates a new materials estimation service
func NewMaterialsEstimationService(aiService *AIService) *MaterialsEstimationService {
	// Default prices (these should be fetched from database or config)
	prices := map[MaterialType]float64{
		Cement:  850.0,   // per 50kg bag
		Sand:    3500.0,  // per tonne
		Ballast: 4000.0,  // per tonne
		Stones:  3800.0,  // per tonne
		Rebar:   95000.0, // per tonne
		Timber:  45000.0, // per cubic meter
		Roofing: 850.0,   // per sheet
		Paint:   2500.0,  // per 20L tin
		Tiles:   450.0,   // per piece
		Bricks:  15.0,    // per piece
	}

	return &MaterialsEstimationService{
		prices:    prices,
		aiService: aiService,
		useAI:     aiService != nil && aiService.IsConfigured(),
	}
}

// EstimateByBuildingType estimates materials for standard building types
func (s *MaterialsEstimationService) EstimateByBuildingType(buildingType BuildingType, floors int) (*MaterialEstimate, error) {
	var estimate *MaterialEstimate
	var err error

	switch buildingType {
	case ThreeBedroom:
		estimate, err = s.estimateThreeBedroom(floors)
	case TwoBedroom:
		estimate, err = s.estimateTwoBedroom(floors)
	case FourBedroom:
		estimate, err = s.estimateFourBedroom(floors)
	default:
		return nil, fmt.Errorf("building type %s not supported for automatic estimation", buildingType)
	}

	if err != nil {
		return nil, err
	}

	return estimate, nil
}

// EstimateWithAI uses AI to estimate materials based on natural language description
func (s *MaterialsEstimationService) EstimateWithAI(projectDescription string, buildingType string, area float64, floors int, additionalInfo string) (*MaterialEstimate, error) {
	if !s.useAI || s.aiService == nil {
		return nil, fmt.Errorf("AI service not available, falling back to manual estimation")
	}

	// Call AI service
	aiReq := EstimateRequest{
		ProjectDescription: projectDescription,
		BuildingType:       buildingType,
		Area:               area,
		Floors:             floors,
		AdditionalInfo:     additionalInfo,
	}

	aiResp, err := s.aiService.EstimateWithAI(aiReq)
	if err != nil {
		return nil, fmt.Errorf("AI estimation failed: %w", err)
	}

	// Convert AI response to our format
	materials := []Material{
		{
			Name:        "Cement",
			Type:        Cement,
			Quantity:    aiResp.CementBags,
			Unit:        Bags,
			UnitPrice:   s.prices[Cement],
			TotalPrice:  aiResp.CementBags * s.prices[Cement],
			Description: "50kg bags (AI-estimated)",
		},
		{
			Name:        "Sand",
			Type:        Sand,
			Quantity:    aiResp.SandTonnes,
			Unit:        Tonnes,
			UnitPrice:   s.prices[Sand],
			TotalPrice:  aiResp.SandTonnes * s.prices[Sand],
			Description: "For mixing mortar and concrete (AI-estimated)",
		},
		{
			Name:        "Ballast",
			Type:        Ballast,
			Quantity:    aiResp.BallastTonnes,
			Unit:        Tonnes,
			UnitPrice:   s.prices[Ballast],
			TotalPrice:  aiResp.BallastTonnes * s.prices[Ballast],
			Description: "For concrete foundation and slab (AI-estimated)",
		},
	}

	// Add other materials from AI response
	if rebarKg, exists := aiResp.OtherMaterials["rebar_kg"]; exists {
		materials = append(materials, Material{
			Name:        "Reinforcement Steel (Rebar)",
			Type:        Rebar,
			Quantity:    rebarKg / 1000, // Convert to tonnes
			Unit:        Tonnes,
			UnitPrice:   s.prices[Rebar],
			TotalPrice:  (rebarKg / 1000) * s.prices[Rebar],
			Description: "For structural reinforcement (AI-estimated)",
		})
	}

	if timberM3, exists := aiResp.OtherMaterials["timber_m3"]; exists {
		materials = append(materials, Material{
			Name:        "Timber",
			Type:        Timber,
			Quantity:    timberM3,
			Unit:        CubicMeters,
			UnitPrice:   s.prices[Timber],
			TotalPrice:  timberM3 * s.prices[Timber],
			Description: "For roofing structure (AI-estimated)",
		})
	}

	// Calculate total from materials
	totalCost := 0.0
	for _, mat := range materials {
		totalCost += mat.TotalPrice
	}

	// Labor cost estimation (40% of materials)
	laborCost := totalCost * 0.40

	// Estimate days (AI can be more accurate here)
	estimatedDays := int(area / 10) // Rough estimate
	if estimatedDays < 7 {
		estimatedDays = 7
	}

	estimate := &MaterialEstimate{
		ProjectType:     fmt.Sprintf("%s - AI-powered estimate", buildingType),
		BuildingArea:    area,
		Materials:       materials,
		TotalCost:       totalCost,
		LaborCost:       laborCost,
		GrandTotal:      totalCost + laborCost,
		EstimatedDays:   estimatedDays,
		Recommendations: append(aiResp.Recommendations, fmt.Sprintf("AI Confidence: %s - %s", aiResp.Confidence, aiResp.Reasoning)),
		Ratios: map[string]string{
			"estimation_method": "AI-powered",
			"confidence":        aiResp.Confidence,
		},
	}

	return estimate, nil
}

// EstimateByArea estimates materials based on floor area
func (s *MaterialsEstimationService) EstimateByArea(area float64, floors int, includeFinishes bool) (*MaterialEstimate, error) {
	if area <= 0 {
		return nil, fmt.Errorf("area must be greater than 0")
	}

	totalArea := area * float64(floors)
	materials := []Material{}

	// Foundation and structure calculations
	// Rule of thumb: 1 bag of cement per 1.5 m2 for foundation and structure
	cementBags := math.Ceil(totalArea / 1.5)
	materials = append(materials, Material{
		Name:        "Cement",
		Type:        Cement,
		Quantity:    cementBags,
		Unit:        Bags,
		UnitPrice:   s.prices[Cement],
		TotalPrice:  cementBags * s.prices[Cement],
		Description: "50kg bags for foundation, walls, and finishing",
	})

	// Sand: 3 tonnes per 50 bags of cement (ratio 1:3)
	sandTonnes := math.Ceil((cementBags / 50) * 3)
	materials = append(materials, Material{
		Name:        "Sand",
		Type:        Sand,
		Quantity:    sandTonnes,
		Unit:        Tonnes,
		UnitPrice:   s.prices[Sand],
		TotalPrice:  sandTonnes * s.prices[Sand],
		Description: "For mixing mortar and concrete",
	})

	// Ballast: 4 tonnes per 50 bags of cement
	ballastTonnes := math.Ceil((cementBags / 50) * 4)
	materials = append(materials, Material{
		Name:        "Ballast",
		Type:        Ballast,
		Quantity:    ballastTonnes,
		Unit:        Tonnes,
		UnitPrice:   s.prices[Ballast],
		TotalPrice:  ballastTonnes * s.prices[Ballast],
		Description: "For concrete foundation and slab",
	})

	// Rebar: 50kg per m2 for typical residential
	rebarKg := totalArea * 50
	materials = append(materials, Material{
		Name:        "Reinforcement Steel (Rebar)",
		Type:        Rebar,
		Quantity:    rebarKg / 1000, // Convert to tonnes
		Unit:        Tonnes,
		UnitPrice:   s.prices[Rebar],
		TotalPrice:  (rebarKg / 1000) * s.prices[Rebar],
		Description: "For structural reinforcement",
	})

	// Timber: 0.3 m3 per m2
	timberM3 := math.Ceil(totalArea * 0.3)
	materials = append(materials, Material{
		Name:        "Timber",
		Type:        Timber,
		Quantity:    timberM3,
		Unit:        CubicMeters,
		UnitPrice:   s.prices[Timber],
		TotalPrice:  timberM3 * s.prices[Timber],
		Description: "For roofing structure and formwork",
	})

	// Roofing sheets: 1 sheet per 1.8 m2 (standard 3m x 0.6m sheet)
	roofingSheets := math.Ceil(area / 1.8)
	materials = append(materials, Material{
		Name:        "Roofing Sheets",
		Type:        Roofing,
		Quantity:    roofingSheets,
		Unit:        Pieces,
		UnitPrice:   s.prices[Roofing],
		TotalPrice:  roofingSheets * s.prices[Roofing],
		Description: "Iron sheets for roofing",
	})

	if includeFinishes {
		// Paint: 1 liter per 10 m2 (2 coats), walls are approx 3x floor area
		wallArea := totalArea * 3
		paintLiters := math.Ceil((wallArea / 10) * 2)
		paintTins := math.Ceil(paintLiters / 20) // 20L tins
		materials = append(materials, Material{
			Name:        "Paint",
			Type:        Paint,
			Quantity:    paintTins,
			Unit:        Pieces,
			UnitPrice:   s.prices[Paint],
			TotalPrice:  paintTins * s.prices[Paint],
			Description: "20L tins for interior and exterior finishing",
		})

		// Tiles: 1 tile per 0.36 m2 (600x600mm tiles)
		tiles := math.Ceil(area / 0.36)
		materials = append(materials, Material{
			Name:        "Floor Tiles",
			Type:        Tiles,
			Quantity:    tiles,
			Unit:        Pieces,
			UnitPrice:   s.prices[Tiles],
			TotalPrice:  tiles * s.prices[Tiles],
			Description: "600x600mm tiles for flooring",
		})
	}

	// Calculate totals
	totalCost := 0.0
	for _, material := range materials {
		totalCost += material.TotalPrice
	}

	// Estimate labor cost (typically 40% of material cost)
	laborCost := totalCost * 0.40
	grandTotal := totalCost + laborCost

	// Estimate construction days (rough estimate)
	estimatedDays := int(math.Ceil(totalArea / 10)) // 10 m2 per day average

	estimate := &MaterialEstimate{
		ProjectType:   fmt.Sprintf("Custom building - %.0f m2", area),
		BuildingArea:  totalArea,
		Materials:     materials,
		TotalCost:     totalCost,
		LaborCost:     laborCost,
		GrandTotal:    grandTotal,
		EstimatedDays: estimatedDays,
		Ratios: map[string]string{
			"cement_to_sand":    "1:3",
			"cement_to_ballast": "1:4",
			"concrete_mix":      "1:2:3 (cement:sand:ballast)",
		},
		Recommendations: []string{
			"Buy materials in bulk for better pricing",
			"Add 10% wastage allowance to quantities",
			"Ensure proper storage for cement (keep dry)",
			"Schedule deliveries to match construction progress",
		},
	}

	return estimate, nil
}

// EstimateByCementQuantity calculates other materials based on desired cement quantity
func (s *MaterialsEstimationService) EstimateByCementQuantity(cementBags float64, mixType string) (*MaterialEstimate, error) {
	if cementBags <= 0 {
		return nil, fmt.Errorf("cement bags must be greater than 0")
	}

	materials := []Material{}

	// Add cement
	materials = append(materials, Material{
		Name:        "Cement",
		Type:        Cement,
		Quantity:    cementBags,
		Unit:        Bags,
		UnitPrice:   s.prices[Cement],
		TotalPrice:  cementBags * s.prices[Cement],
		Description: "50kg bags",
	})

	var sandRatio, ballastRatio float64
	var description string

	switch mixType {
	case "foundation":
		// 1:3:4 mix (cement:sand:ballast)
		sandRatio = 3.0
		ballastRatio = 4.0
		description = "Foundation mix (1:3:4)"
	case "structural":
		// 1:2:3 mix
		sandRatio = 2.0
		ballastRatio = 3.0
		description = "Structural concrete mix (1:2:3)"
	case "screed":
		// 1:4 mix (cement:sand only)
		sandRatio = 4.0
		ballastRatio = 0.0
		description = "Floor screed mix (1:4)"
	case "mortar":
		// 1:3 mix (cement:sand only)
		sandRatio = 3.0
		ballastRatio = 0.0
		description = "Masonry mortar (1:3)"
	default:
		// Default to structural mix
		sandRatio = 2.0
		ballastRatio = 3.0
		description = "Structural mix (1:2:3)"
	}

	// Calculate sand (1 bag cement ≈ 0.035 m3, 1 tonne sand ≈ 0.75 m3)
	sandM3 := (cementBags * 0.035) * sandRatio
	sandTonnes := math.Ceil(sandM3 / 0.75)
	materials = append(materials, Material{
		Name:        "Sand",
		Type:        Sand,
		Quantity:    sandTonnes,
		Unit:        Tonnes,
		UnitPrice:   s.prices[Sand],
		TotalPrice:  sandTonnes * s.prices[Sand],
		Description: fmt.Sprintf("For %s", description),
	})

	// Calculate ballast if needed
	if ballastRatio > 0 {
		ballastM3 := (cementBags * 0.035) * ballastRatio
		ballastTonnes := math.Ceil(ballastM3 / 0.65) // 1 tonne ballast ≈ 0.65 m3
		materials = append(materials, Material{
			Name:        "Ballast",
			Type:        Ballast,
			Quantity:    ballastTonnes,
			Unit:        Tonnes,
			UnitPrice:   s.prices[Ballast],
			TotalPrice:  ballastTonnes * s.prices[Ballast],
			Description: fmt.Sprintf("For %s", description),
		})
	}

	// Calculate totals
	totalCost := 0.0
	for _, material := range materials {
		totalCost += material.TotalPrice
	}

	estimate := &MaterialEstimate{
		ProjectType:  fmt.Sprintf("Custom mix - %.0f bags cement", cementBags),
		BuildingArea: 0,
		Materials:    materials,
		TotalCost:    totalCost,
		LaborCost:    0,
		GrandTotal:   totalCost,
		Ratios: map[string]string{
			"mix_ratio":   fmt.Sprintf("1:%.0f:%.0f", sandRatio, ballastRatio),
			"description": description,
		},
		Recommendations: []string{
			"Mix thoroughly for consistent strength",
			"Add water gradually to achieve workability",
			"Cure concrete properly (keep moist for 7 days)",
			"Use within 30 minutes of mixing",
		},
	}

	return estimate, nil
}

// estimateThreeBedroom provides detailed estimate for 3-bedroom house
func (s *MaterialsEstimationService) estimateThreeBedroom(floors int) (*MaterialEstimate, error) {
	// Typical 3-bedroom: 120-150 m2
	area := 135.0 * float64(floors)
	return s.EstimateByArea(area, floors, true)
}

// estimateTwoBedroom provides detailed estimate for 2-bedroom house
func (s *MaterialsEstimationService) estimateTwoBedroom(floors int) (*MaterialEstimate, error) {
	// Typical 2-bedroom: 80-100 m2
	area := 90.0 * float64(floors)
	return s.EstimateByArea(area, floors, true)
}

// estimateFourBedroom provides detailed estimate for 4-bedroom house
func (s *MaterialsEstimationService) estimateFourBedroom(floors int) (*MaterialEstimate, error) {
	// Typical 4-bedroom: 160-200 m2
	area := 180.0 * float64(floors)
	return s.EstimateByArea(area, floors, true)
}

// UpdateMaterialPrice allows updating a material price
func (s *MaterialsEstimationService) UpdateMaterialPrice(material MaterialType, price float64) error {
	if price <= 0 {
		return fmt.Errorf("price must be greater than 0")
	}
	s.prices[material] = price
	return nil
}

// GetMaterialPrice retrieves the current price for a material
func (s *MaterialsEstimationService) GetMaterialPrice(material MaterialType) (float64, error) {
	price, exists := s.prices[material]
	if !exists {
		return 0, fmt.Errorf("price for material %s not found", material)
	}
	return price, nil
}

// GetAllPrices returns all material prices
func (s *MaterialsEstimationService) GetAllPrices() map[MaterialType]float64 {
	return s.prices
}
