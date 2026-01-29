package models

import "time"

// Customer represents a customer in the system
type Customer struct {
	ID           int        `db:"Id" json:"id"`
	Name         string     `db:"Name" json:"name"`
	Phone        *string    `db:"Phone" json:"phone,omitempty"`
	Email        *string    `db:"Email" json:"email,omitempty"`
	Address      *string    `db:"Address" json:"address,omitempty"`
	CustomerType string     `db:"CustomerType" json:"customerType"`
	IsActive     bool       `db:"IsActive" json:"isActive"`
	CreatedAt    time.Time  `db:"CreatedAt" json:"createdAt"`
	UpdatedAt    *time.Time `db:"UpdatedAt" json:"updatedAt,omitempty"`
}
