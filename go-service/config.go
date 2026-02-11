package main

import (
	"log"
	"os"
)

// Config holds all configuration for the service
type Config struct {
	Port string

	// Google Maps configuration
	GoogleMapsAPIKey string

	// AI configuration
	AIAPIKey string
	AIAPIURL string
	AIModel  string

	// Feature flags
	EnableGoogleMaps bool
	EnableAI         bool
}

// LoadConfig loads configuration from environment variables
func LoadConfig() *Config {
	config := &Config{
		Port: getEnv("PORT", "8081"),

		// Google Maps
		GoogleMapsAPIKey: getEnv("GOOGLE_MAPS_API_KEY", ""),

		// AI Configuration
		AIAPIKey: getEnv("AI_API_KEY", ""),
		AIAPIURL: getEnv("AI_API_URL", "https://api.openai.com/v1"),
		AIModel:  getEnv("AI_MODEL", "gpt-4"),

		// Feature flags
		EnableGoogleMaps: getEnvBool("ENABLE_GOOGLE_MAPS", true),
		EnableAI:         getEnvBool("ENABLE_AI", true),
	}

	// Log configuration status
	log.Println("Configuration loaded:")
	log.Printf("  Port: %s", config.Port)
	log.Printf("  Google Maps enabled: %v (API key configured: %v)", config.EnableGoogleMaps, config.GoogleMapsAPIKey != "")
	log.Printf("  AI enabled: %v (API key configured: %v)", config.EnableAI, config.AIAPIKey != "")
	log.Printf("  AI Model: %s", config.AIModel)

	return config
}

// getEnv gets an environment variable with a default value
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

// getEnvBool gets a boolean environment variable with a default value
func getEnvBool(key string, defaultValue bool) bool {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value == "true" || value == "1" || value == "yes"
}
