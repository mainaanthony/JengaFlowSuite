package handlers

import (
	"encoding/json"
	"net/http"

	"example.com/go-service/models"
	"example.com/go-service/services"
)

// RouteOptimizerHandler handles route optimization HTTP requests
type RouteOptimizerHandler struct {
	service *services.RouteOptimizerService
}

// NewRouteOptimizerHandler creates a new route optimizer handler
func NewRouteOptimizerHandler(service *services.RouteOptimizerService) *RouteOptimizerHandler {
	return &RouteOptimizerHandler{
		service: service,
	}
}

// OptimizeSingleDriverRequest represents request for single driver optimization
type OptimizeSingleDriverRequest struct {
	DriverID      int                       `json:"driverId"`
	DriverName    string                    `json:"driverName"`
	Deliveries    []models.Delivery         `json:"deliveries"`
	Locations     map[int]services.Location `json:"locations"` // map[deliveryID]Location
	StartLocation services.Location         `json:"startLocation"`
}

// OptimizeMultipleDriversRequest represents request for multiple driver optimization
type OptimizeMultipleDriversRequest struct {
	Drivers       []models.Driver           `json:"drivers"`
	Deliveries    []models.Delivery         `json:"deliveries"`
	Locations     map[int]services.Location `json:"locations"`
	DepotLocation services.Location         `json:"depotLocation"`
}

// OptimizeSingleDriver handles POST /api/routes/optimize/single
func (h *RouteOptimizerHandler) OptimizeSingleDriver(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req OptimizeSingleDriverRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	route, err := h.service.OptimizeRouteForDriver(
		req.DriverID,
		req.DriverName,
		req.Deliveries,
		req.Locations,
		req.StartLocation,
	)

	if err != nil {
		http.Error(w, "Failed to optimize route: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"route":   route,
	})
}

// OptimizeMultipleDrivers handles POST /api/routes/optimize/multiple
func (h *RouteOptimizerHandler) OptimizeMultipleDrivers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req OptimizeMultipleDriversRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	routes, err := h.service.OptimizeMultipleDriverRoutes(
		req.Drivers,
		req.Deliveries,
		req.Locations,
		req.DepotLocation,
	)

	if err != nil {
		http.Error(w, "Failed to optimize routes: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"routes":  routes,
		"count":   len(routes),
	})
}

// GetRouteExample handles GET /api/routes/example - returns example request format
func (h *RouteOptimizerHandler) GetRouteExample(w http.ResponseWriter, r *http.Request) {
	example := map[string]interface{}{
		"description": "Route Optimization API",
		"endpoints": map[string]interface{}{
			"single_driver": map[string]interface{}{
				"method":      "POST",
				"path":        "/api/routes/optimize/single",
				"description": "Optimize route for a single driver",
				"example": OptimizeSingleDriverRequest{
					DriverID:   1,
					DriverName: "John Doe",
					Deliveries: []models.Delivery{
						{
							ID:              1,
							DeliveryAddress: "123 Main St, Nairobi",
							Priority:        "High",
						},
					},
					Locations: map[int]services.Location{
						1: {Lat: -1.286389, Lng: 36.817223},
					},
					StartLocation: services.Location{Lat: -1.286389, Lng: 36.817223},
				},
			},
			"multiple_drivers": map[string]interface{}{
				"method":      "POST",
				"path":        "/api/routes/optimize/multiple",
				"description": "Optimize routes for multiple drivers",
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(example)
}
