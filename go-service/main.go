package main

import (
	"encoding/json"
	"log"
	"net/http"

	"example.com/go-service/handlers"
	"example.com/go-service/services"
)

// enableCORS adds CORS headers to responses
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func main() {
	// Load configuration
	config := LoadConfig()

	// Initialize Google Maps service
	var googleMapsService *services.GoogleMapsService
	if config.EnableGoogleMaps && config.GoogleMapsAPIKey != "" {
		googleMapsService = services.NewGoogleMapsService(config.GoogleMapsAPIKey)
		log.Println("Google Maps service initialized")
	} else {
		log.Println("Google Maps service disabled or API key not configured")
	}

	// Initialize AI service
	var aiService *services.AIService
	if config.EnableAI && config.AIAPIKey != "" {
		aiService = services.NewAIService(config.AIAPIKey, config.AIAPIURL, config.AIModel)
		log.Println("AI service initialized")
	} else {
		log.Println("AI service disabled or API key not configured")
	}

	// Initialize services
	routeOptimizerService := services.NewRouteOptimizerService(googleMapsService)
	materialsEstimationService := services.NewMaterialsEstimationService(aiService)

	// Initialize handlers
	routeHandler := handlers.NewRouteOptimizerHandler(routeOptimizerService)
	materialsHandler := handlers.NewMaterialsEstimationHandler(materialsEstimationService)

	// Setup routes
	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("/health", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  "ok",
			"service": "go-service",
			"features": map[string]bool{
				"googleMaps": googleMapsService != nil && googleMapsService.IsConfigured(),
				"ai":         aiService != nil && aiService.IsConfigured(),
			},
		})
	}))

	// Welcome endpoint
	mux.HandleFunc("/hello", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "hello from go-service"})
	}))

	// API documentation endpoint
	mux.HandleFunc("/api", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"service":     "JengaFlow Go Service",
			"version":     "2.0.0",
			"description": "AI-powered route optimization and materials estimation service",
			"features": map[string]interface{}{
				"googleMapsEnabled": googleMapsService != nil && googleMapsService.IsConfigured(),
				"aiEnabled":         aiService != nil && aiService.IsConfigured(),
			},
			"endpoints": map[string]string{
				"routes":    "/api/routes/examples",
				"materials": "/api/materials/examples",
			},
		})
	}))

	// Route Optimization Endpoints
	mux.HandleFunc("/api/routes/examples", enableCORS(routeHandler.GetRouteExample))
	mux.HandleFunc("/api/routes/optimize/single", enableCORS(routeHandler.OptimizeSingleDriver))
	mux.HandleFunc("/api/routes/optimize/multiple", enableCORS(routeHandler.OptimizeMultipleDrivers))

	// Materials Estimation Endpoints
	mux.HandleFunc("/api/materials/examples", enableCORS(materialsHandler.GetExamples))
	mux.HandleFunc("/api/materials/estimate/building", enableCORS(materialsHandler.EstimateByBuildingType))
	mux.HandleFunc("/api/materials/estimate/area", enableCORS(materialsHandler.EstimateByArea))
	mux.HandleFunc("/api/materials/estimate/cement", enableCORS(materialsHandler.EstimateByCement))
	mux.HandleFunc("/api/materials/estimate/ai", enableCORS(materialsHandler.EstimateWithAI))
	mux.HandleFunc("/api/materials/prices", enableCORS(materialsHandler.GetPrices))
	mux.HandleFunc("/api/materials/prices/update", enableCORS(materialsHandler.UpdatePrice))

	log.Printf("===========================================")
	log.Printf("JengaFlow Go Service v2.0")
	log.Printf("===========================================")
	log.Printf("Server listening on port: %s", config.Port)
	log.Printf("Health check: http://localhost:%s/health", config.Port)
	log.Printf("API docs: http://localhost:%s/api", config.Port)
	log.Printf("Route optimization: http://localhost:%s/api/routes/examples", config.Port)
	log.Printf("Materials estimation: http://localhost:%s/api/materials/examples", config.Port)
	log.Printf("===========================================")
	if googleMapsService != nil && googleMapsService.IsConfigured() {
		log.Printf("✓ Google Maps API: ENABLED")
	} else {
		log.Printf("✗ Google Maps API: DISABLED (set GOOGLE_MAPS_API_KEY)")
	}
	if aiService != nil && aiService.IsConfigured() {
		log.Printf("✓ AI Service: ENABLED (%s)", config.AIModel)
	} else {
		log.Printf("✗ AI Service: DISABLED (set AI_API_KEY)")
	}
	log.Printf("===========================================")

	log.Fatal(http.ListenAndServe(":"+config.Port, mux))
}
