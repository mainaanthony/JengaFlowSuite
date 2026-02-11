package services

import (
	"fmt"
	"math"
	"sort"
	"time"

	"example.com/go-service/models"
)

// Location represents a geographical coordinate
type Location struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

// DeliveryPoint represents a delivery location with details
type DeliveryPoint struct {
	Delivery models.Delivery `json:"delivery"`
	Location Location        `json:"location"`
	Address  string          `json:"address"`
}

// OptimizedRoute represents an optimized delivery route
type OptimizedRoute struct {
	DriverID          int             `json:"driverId"`
	DriverName        string          `json:"driverName"`
	TotalDistance     float64         `json:"totalDistance"`
	EstimatedDuration float64         `json:"estimatedDuration"` // in minutes
	DeliverySequence  []DeliveryPoint `json:"deliverySequence"`
	StartTime         time.Time       `json:"startTime"`
}

// RouteOptimizerService handles route optimization logic
type RouteOptimizerService struct {
	googleMapsService *GoogleMapsService
	useAI             bool
}

// NewRouteOptimizerService creates a new route optimizer service
func NewRouteOptimizerService(googleMapsService *GoogleMapsService) *RouteOptimizerService {
	return &RouteOptimizerService{
		googleMapsService: googleMapsService,
		useAI:             googleMapsService != nil && googleMapsService.IsConfigured(),
	}
}

// OptimizeRouteForDriver optimizes delivery routes for a specific driver using nearest neighbor algorithm
func (s *RouteOptimizerService) OptimizeRouteForDriver(
	driverID int,
	driverName string,
	deliveries []models.Delivery,
	locations map[int]Location, // map[deliveryID]Location
	startLocation Location,
) (*OptimizedRoute, error) {
	if len(deliveries) == 0 {
		return nil, fmt.Errorf("no deliveries to optimize")
	}

	// Try Google Maps optimization if available
	if s.useAI && s.googleMapsService != nil {
		route, err := s.optimizeWithGoogleMaps(driverID, driverName, deliveries, locations, startLocation)
		if err == nil {
			return route, nil
		}
		// If Google Maps fails, fall back to manual optimization
		fmt.Printf("Google Maps optimization failed: %v, falling back to manual\n", err)
	}

	// Manual optimization
	return s.optimizeManually(driverID, driverName, deliveries, locations, startLocation)
}

// optimizeWithGoogleMaps uses Google Maps API for intelligent route optimization
func (s *RouteOptimizerService) optimizeWithGoogleMaps(
	driverID int,
	driverName string,
	deliveries []models.Delivery,
	locations map[int]Location,
	startLocation Location,
) (*OptimizedRoute, error) {
	// Sort by priority first
	sortedDeliveries := make([]models.Delivery, len(deliveries))
	copy(sortedDeliveries, deliveries)
	sort.Slice(sortedDeliveries, func(i, j int) bool {
		return getPriorityValue(sortedDeliveries[i].Priority) > getPriorityValue(sortedDeliveries[j].Priority)
	})

	// Prepare waypoints (delivery locations)
	waypoints := make([]Location, 0, len(sortedDeliveries))
	deliveryMap := make(map[int]models.Delivery)
	for _, delivery := range sortedDeliveries {
		loc, exists := locations[delivery.ID]
		if !exists {
			continue
		}
		waypoints = append(waypoints, loc)
		deliveryMap[len(waypoints)-1] = delivery
	}

	if len(waypoints) == 0 {
		return nil, fmt.Errorf("no valid delivery locations")
	}

	// Use last delivery location as destination if we have waypoints
	destination := waypoints[len(waypoints)-1]
	waypoints = waypoints[:len(waypoints)-1]

	// Get optimized route from Google Maps
	directionsResult, err := s.googleMapsService.GetOptimizedRoute(startLocation, destination, waypoints)
	if err != nil {
		return nil, err
	}

	// Build optimized delivery sequence based on Google's optimization
	optimizedSequence := make([]DeliveryPoint, 0, len(sortedDeliveries))

	// First, add waypoints in optimized order
	for _, idx := range directionsResult.OptimizedOrder {
		if delivery, exists := deliveryMap[idx]; exists {
			loc := locations[delivery.ID]
			optimizedSequence = append(optimizedSequence, DeliveryPoint{
				Delivery: delivery,
				Location: loc,
				Address:  delivery.DeliveryAddress,
			})
		}
	}

	// Add the final destination
	if finalDelivery, exists := deliveryMap[len(waypoints)]; exists {
		optimizedSequence = append(optimizedSequence, DeliveryPoint{
			Delivery: finalDelivery,
			Location: destination,
			Address:  finalDelivery.DeliveryAddress,
		})
	}

	// Add service time (5 minutes per delivery)
	totalDuration := directionsResult.TotalDuration + float64(len(optimizedSequence)*5)

	return &OptimizedRoute{
		DriverID:          driverID,
		DriverName:        driverName,
		TotalDistance:     directionsResult.TotalDistance,
		EstimatedDuration: totalDuration,
		DeliverySequence:  optimizedSequence,
		StartTime:         time.Now(),
	}, nil
}

// optimizeManually uses nearest neighbor algorithm for route optimization
func (s *RouteOptimizerService) optimizeManually(
	driverID int,
	driverName string,
	deliveries []models.Delivery,
	locations map[int]Location,
	startLocation Location,
) (*OptimizedRoute, error) {
	// Create delivery points
	deliveryPoints := make([]DeliveryPoint, 0, len(deliveries))
	for _, delivery := range deliveries {
		loc, exists := locations[delivery.ID]
		if !exists {
			// If location not provided, skip or use default
			continue
		}
		deliveryPoints = append(deliveryPoints, DeliveryPoint{
			Delivery: delivery,
			Location: loc,
			Address:  delivery.DeliveryAddress,
		})
	}

	// Sort by priority first (High > Medium > Low)
	sort.Slice(deliveryPoints, func(i, j int) bool {
		return getPriorityValue(deliveryPoints[i].Delivery.Priority) > getPriorityValue(deliveryPoints[j].Delivery.Priority)
	})

	// Apply nearest neighbor algorithm
	optimizedSequence := s.nearestNeighborOptimization(startLocation, deliveryPoints)

	// Calculate total distance and duration
	totalDistance := 0.0
	currentLoc := startLocation

	for _, point := range optimizedSequence {
		distance := calculateDistance(currentLoc, point.Location)
		totalDistance += distance
		currentLoc = point.Location
	}

	// Estimate duration (assume average speed of 40 km/h in city + 5 min per delivery)
	estimatedDuration := (totalDistance / 40.0 * 60.0) + float64(len(optimizedSequence)*5)

	route := &OptimizedRoute{
		DriverID:          driverID,
		DriverName:        driverName,
		TotalDistance:     totalDistance,
		EstimatedDuration: estimatedDuration,
		DeliverySequence:  optimizedSequence,
		StartTime:         time.Now(),
	}

	return route, nil
}

// nearestNeighborOptimization applies the nearest neighbor algorithm
func (s *RouteOptimizerService) nearestNeighborOptimization(start Location, points []DeliveryPoint) []DeliveryPoint {
	if len(points) == 0 {
		return []DeliveryPoint{}
	}

	visited := make(map[int]bool)
	result := make([]DeliveryPoint, 0, len(points))
	currentLoc := start

	// Handle priority deliveries first
	highPriorityPoints := []DeliveryPoint{}
	regularPoints := []DeliveryPoint{}

	for _, point := range points {
		if point.Delivery.Priority == "High" {
			highPriorityPoints = append(highPriorityPoints, point)
		} else {
			regularPoints = append(regularPoints, point)
		}
	}

	// Process high priority first
	for len(highPriorityPoints) > 0 {
		nearestIdx := -1
		minDistance := math.MaxFloat64

		for i, point := range highPriorityPoints {
			if visited[point.Delivery.ID] {
				continue
			}
			distance := calculateDistance(currentLoc, point.Location)
			if distance < minDistance {
				minDistance = distance
				nearestIdx = i
			}
		}

		if nearestIdx != -1 {
			nearest := highPriorityPoints[nearestIdx]
			result = append(result, nearest)
			visited[nearest.Delivery.ID] = true
			currentLoc = nearest.Location
			// Remove from list
			highPriorityPoints = append(highPriorityPoints[:nearestIdx], highPriorityPoints[nearestIdx+1:]...)
		} else {
			break
		}
	}

	// Then process regular deliveries
	for len(visited) < len(points) {
		nearestIdx := -1
		minDistance := math.MaxFloat64

		for i, point := range regularPoints {
			if visited[point.Delivery.ID] {
				continue
			}
			distance := calculateDistance(currentLoc, point.Location)
			if distance < minDistance {
				minDistance = distance
				nearestIdx = i
			}
		}

		if nearestIdx == -1 {
			break
		}

		nearest := regularPoints[nearestIdx]
		result = append(result, nearest)
		visited[nearest.Delivery.ID] = true
		currentLoc = nearest.Location
	}

	return result
}

// OptimizeMultipleDriverRoutes distributes and optimizes deliveries across multiple drivers
func (s *RouteOptimizerService) OptimizeMultipleDriverRoutes(
	drivers []models.Driver,
	deliveries []models.Delivery,
	locations map[int]Location,
	depotLocation Location,
) ([]*OptimizedRoute, error) {
	if len(drivers) == 0 {
		return nil, fmt.Errorf("no drivers available")
	}
	if len(deliveries) == 0 {
		return nil, fmt.Errorf("no deliveries to assign")
	}

	// Filter active drivers
	activeDrivers := []models.Driver{}
	for _, driver := range drivers {
		if driver.IsActive && driver.Status == "Available" {
			activeDrivers = append(activeDrivers, driver)
		}
	}

	if len(activeDrivers) == 0 {
		return nil, fmt.Errorf("no active drivers available")
	}

	// Distribute deliveries across drivers (simple distribution by count)
	deliveriesPerDriver := len(deliveries) / len(activeDrivers)
	if deliveriesPerDriver == 0 {
		deliveriesPerDriver = 1
	}

	routes := make([]*OptimizedRoute, 0, len(activeDrivers))
	deliveryIdx := 0

	for i, driver := range activeDrivers {
		// Determine how many deliveries for this driver
		remaining := len(deliveries) - deliveryIdx
		count := deliveriesPerDriver
		if i == len(activeDrivers)-1 {
			// Last driver gets remaining deliveries
			count = remaining
		} else if remaining < deliveriesPerDriver {
			count = remaining
		}

		if count == 0 {
			break
		}

		driverDeliveries := deliveries[deliveryIdx : deliveryIdx+count]
		deliveryIdx += count

		route, err := s.OptimizeRouteForDriver(
			driver.ID,
			driver.Name,
			driverDeliveries,
			locations,
			depotLocation,
		)

		if err != nil {
			continue
		}

		routes = append(routes, route)
	}

	return routes, nil
}

// calculateDistance calculates the Haversine distance between two locations in kilometers
func calculateDistance(from, to Location) float64 {
	const earthRadius = 6371.0 // Earth's radius in kilometers

	lat1Rad := from.Lat * math.Pi / 180
	lat2Rad := to.Lat * math.Pi / 180
	deltaLat := (to.Lat - from.Lat) * math.Pi / 180
	deltaLng := (to.Lng - from.Lng) * math.Pi / 180

	a := math.Sin(deltaLat/2)*math.Sin(deltaLat/2) +
		math.Cos(lat1Rad)*math.Cos(lat2Rad)*
			math.Sin(deltaLng/2)*math.Sin(deltaLng/2)

	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	distance := earthRadius * c
	return distance
}

// getPriorityValue returns numeric value for priority comparison
func getPriorityValue(priority string) int {
	switch priority {
	case "High":
		return 3
	case "Medium":
		return 2
	case "Low":
		return 1
	default:
		return 0
	}
}
