package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// GoogleMapsService handles interactions with Google Maps API
type GoogleMapsService struct {
	apiKey     string
	httpClient *http.Client
}

// NewGoogleMapsService creates a new Google Maps service
func NewGoogleMapsService(apiKey string) *GoogleMapsService {
	return &GoogleMapsService{
		apiKey: apiKey,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// DistanceMatrixResult represents distance and duration between two points
type DistanceMatrixResult struct {
	Distance float64 // in kilometers
	Duration float64 // in minutes
	Status   string
}

// DirectionsResult represents optimized route from Google Directions API
type DirectionsResult struct {
	Route           []Location
	TotalDistance   float64 // in kilometers
	TotalDuration   float64 // in minutes
	OptimizedOrder  []int   // Optimized waypoint indices
	EncodedPolyline string
}

// GetDistanceMatrix gets distance and duration between multiple origins and destinations
func (s *GoogleMapsService) GetDistanceMatrix(origins, destinations []Location) ([][]DistanceMatrixResult, error) {
	if s.apiKey == "" {
		return nil, fmt.Errorf("Google Maps API key not configured")
	}

	// Format origins
	originsStr := make([]string, len(origins))
	for i, loc := range origins {
		originsStr[i] = fmt.Sprintf("%.6f,%.6f", loc.Lat, loc.Lng)
	}

	// Format destinations
	destinationsStr := make([]string, len(destinations))
	for i, loc := range destinations {
		destinationsStr[i] = fmt.Sprintf("%.6f,%.6f", loc.Lat, loc.Lng)
	}

	// Build URL
	baseURL := "https://maps.googleapis.com/maps/api/distancematrix/json"
	params := url.Values{}
	params.Add("origins", strings.Join(originsStr, "|"))
	params.Add("destinations", strings.Join(destinationsStr, "|"))
	params.Add("key", s.apiKey)
	params.Add("units", "metric")

	requestURL := baseURL + "?" + params.Encode()

	// Make request
	resp, err := s.httpClient.Get(requestURL)
	if err != nil {
		return nil, fmt.Errorf("failed to call Distance Matrix API: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	// Parse response
	var result struct {
		Status string `json:"status"`
		Rows   []struct {
			Elements []struct {
				Status   string `json:"status"`
				Distance struct {
					Value int `json:"value"` // meters
				} `json:"distance"`
				Duration struct {
					Value int `json:"value"` // seconds
				} `json:"duration"`
			} `json:"elements"`
		} `json:"rows"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	if result.Status != "OK" {
		return nil, fmt.Errorf("API returned status: %s", result.Status)
	}

	// Convert to our format
	matrix := make([][]DistanceMatrixResult, len(result.Rows))
	for i, row := range result.Rows {
		matrix[i] = make([]DistanceMatrixResult, len(row.Elements))
		for j, element := range row.Elements {
			matrix[i][j] = DistanceMatrixResult{
				Distance: float64(element.Distance.Value) / 1000.0, // Convert to km
				Duration: float64(element.Duration.Value) / 60.0,   // Convert to minutes
				Status:   element.Status,
			}
		}
	}

	return matrix, nil
}

// GetOptimizedRoute gets an optimized route using Google Directions API with waypoint optimization
func (s *GoogleMapsService) GetOptimizedRoute(origin Location, destination Location, waypoints []Location) (*DirectionsResult, error) {
	if s.apiKey == "" {
		return nil, fmt.Errorf("Google Maps API key not configured")
	}

	// Build URL
	baseURL := "https://maps.googleapis.com/maps/api/directions/json"
	params := url.Values{}
	params.Add("origin", fmt.Sprintf("%.6f,%.6f", origin.Lat, origin.Lng))
	params.Add("destination", fmt.Sprintf("%.6f,%.6f", destination.Lat, destination.Lng))
	params.Add("key", s.apiKey)
	params.Add("optimize", "true") // This tells Google to optimize waypoint order

	// Add waypoints
	if len(waypoints) > 0 {
		waypointsStr := make([]string, len(waypoints))
		for i, wp := range waypoints {
			waypointsStr[i] = fmt.Sprintf("%.6f,%.6f", wp.Lat, wp.Lng)
		}
		params.Add("waypoints", "optimize:true|"+strings.Join(waypointsStr, "|"))
	}

	requestURL := baseURL + "?" + params.Encode()

	// Make request
	resp, err := s.httpClient.Get(requestURL)
	if err != nil {
		return nil, fmt.Errorf("failed to call Directions API: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	// Parse response
	var result struct {
		Status string `json:"status"`
		Routes []struct {
			Legs []struct {
				Distance struct {
					Value int `json:"value"` // meters
				} `json:"distance"`
				Duration struct {
					Value int `json:"value"` // seconds
				} `json:"duration"`
			} `json:"legs"`
			WaypointOrder    []int `json:"waypoint_order"`
			OverviewPolyline struct {
				Points string `json:"points"`
			} `json:"overview_polyline"`
		} `json:"routes"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	if result.Status != "OK" {
		return nil, fmt.Errorf("API returned status: %s", result.Status)
	}

	if len(result.Routes) == 0 {
		return nil, fmt.Errorf("no routes found")
	}

	route := result.Routes[0]

	// Calculate total distance and duration
	totalDistance := 0.0
	totalDuration := 0.0
	for _, leg := range route.Legs {
		totalDistance += float64(leg.Distance.Value) / 1000.0 // Convert to km
		totalDuration += float64(leg.Duration.Value) / 60.0   // Convert to minutes
	}

	return &DirectionsResult{
		TotalDistance:   totalDistance,
		TotalDuration:   totalDuration,
		OptimizedOrder:  route.WaypointOrder,
		EncodedPolyline: route.OverviewPolyline.Points,
	}, nil
}

// GeocodeAddress converts an address to coordinates
func (s *GoogleMapsService) GeocodeAddress(address string) (*Location, error) {
	if s.apiKey == "" {
		return nil, fmt.Errorf("Google Maps API key not configured")
	}

	baseURL := "https://maps.googleapis.com/maps/api/geocode/json"
	params := url.Values{}
	params.Add("address", address)
	params.Add("key", s.apiKey)

	requestURL := baseURL + "?" + params.Encode()

	resp, err := s.httpClient.Get(requestURL)
	if err != nil {
		return nil, fmt.Errorf("failed to call Geocoding API: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	var result struct {
		Status  string `json:"status"`
		Results []struct {
			Geometry struct {
				Location struct {
					Lat float64 `json:"lat"`
					Lng float64 `json:"lng"`
				} `json:"location"`
			} `json:"geometry"`
		} `json:"results"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	if result.Status != "OK" || len(result.Results) == 0 {
		return nil, fmt.Errorf("could not geocode address: %s", result.Status)
	}

	return &Location{
		Lat: result.Results[0].Geometry.Location.Lat,
		Lng: result.Results[0].Geometry.Location.Lng,
	}, nil
}

// IsConfigured checks if the service has an API key
func (s *GoogleMapsService) IsConfigured() bool {
	return s.apiKey != ""
}
