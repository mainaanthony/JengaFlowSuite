package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/microsoft/go-mssqldb" // SQL Server driver
)

// Config holds database configuration
type Config struct {
	Server   string
	Port     int
	Database string
	User     string
	Password string
	Schema   string
}

// DB holds the database connection
type DB struct {
	*sql.DB
}

// NewDB creates a new database connection
func NewDB(config Config) (*DB, error) {
	// Build connection string for SQL Server
	connString := fmt.Sprintf(
		"server=%s;port=%d;database=%s;user id=%s;password=%s;TrustServerCertificate=true",
		config.Server,
		config.Port,
		config.Database,
		config.User,
		config.Password,
	)

	db, err := sql.Open("mssql", connString)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %w", err)
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("error connecting to database: %w", err)
	}

	log.Printf("Successfully connected to SQL Server database: %s", config.Database)

	// Set default schema if provided
	if config.Schema != "" {
		_, err = db.Exec(fmt.Sprintf("ALTER USER %s WITH DEFAULT_SCHEMA = %s", config.User, config.Schema))
		if err != nil {
			log.Printf("Warning: Could not set default schema: %v", err)
		}
	}

	return &DB{db}, nil
}

// LoadConfigFromEnv loads database configuration from environment variables
func LoadConfigFromEnv() Config {
	return Config{
		Server:   getEnv("DB_SERVER", "localhost"),
		Port:     getEnvAsInt("DB_PORT", 1438),
		Database: getEnv("DB_DATABASE", "AppDb"),
		User:     getEnv("DB_USER", "sa"),
		Password: getEnv("DB_PASSWORD", "Your!StrongPassw0rd"),
		Schema:   getEnv("DB_SCHEMA", "jengaFlow"),
	}
}

func getEnv(key, defaultVal string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultVal
}

func getEnvAsInt(key string, defaultVal int) int {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultVal
	}
	var value int
	fmt.Sscanf(valueStr, "%d", &value)
	return value
}

// Close closes the database connection
func (db *DB) Close() error {
	return db.DB.Close()
}
