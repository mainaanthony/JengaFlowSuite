package models

import "time"

// Supplier represents a supplier/vendor
type Supplier struct {
	ID            int        `db:"Id" json:"id"`
	Name          string     `db:"Name" json:"name"`
	ContactPerson *string    `db:"ContactPerson" json:"contactPerson,omitempty"`
	Phone         string     `db:"Phone" json:"phone"`
	Email         string     `db:"Email" json:"email"`
	Address       *string    `db:"Address" json:"address,omitempty"`
	Category      *string    `db:"Category" json:"category,omitempty"`
	Rating        float64    `db:"Rating" json:"rating"`
	IsActive      bool       `db:"IsActive" json:"isActive"`
	CreatedAt     time.Time  `db:"CreatedAt" json:"createdAt"`
	UpdatedAt     *time.Time `db:"UpdatedAt" json:"updatedAt,omitempty"`
}
