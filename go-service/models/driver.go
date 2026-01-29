package models

import "time"

// Driver represents a delivery driver
type Driver struct {
	ID                  int        `db:"Id" json:"id"`
	Name                string     `db:"Name" json:"name"`
	Phone               string     `db:"Phone" json:"phone"`
	LicenseNumber       *string    `db:"LicenseNumber" json:"licenseNumber,omitempty"`
	Vehicle             string     `db:"Vehicle" json:"vehicle"`
	VehicleRegistration *string    `db:"VehicleRegistration" json:"vehicleRegistration,omitempty"`
	Status              string     `db:"Status" json:"status"`
	Rating              float64    `db:"Rating" json:"rating"`
	IsActive            bool       `db:"IsActive" json:"isActive"`
	CreatedAt           time.Time  `db:"CreatedAt" json:"createdAt"`
	UpdatedAt           *time.Time `db:"UpdatedAt" json:"updatedAt,omitempty"`
}
