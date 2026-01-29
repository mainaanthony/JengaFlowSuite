package models

import "time"

// Category represents a product category
type Category struct {
	ID          int        `db:"Id" json:"id"`
	Name        string     `db:"Name" json:"name"`
	Description *string    `db:"Description" json:"description,omitempty"`
	IsActive    bool       `db:"IsActive" json:"isActive"`
	CreatedAt   time.Time  `db:"CreatedAt" json:"createdAt"`
	UpdatedAt   *time.Time `db:"UpdatedAt" json:"updatedAt,omitempty"`
}
