package models

import "time"

// Role represents a user role in the system
type Role struct {
	ID          int        `db:"Id" json:"id"`
	Name        string     `db:"Name" json:"name"`
	Description *string    `db:"Description" json:"description,omitempty"`
	CreatedAt   time.Time  `db:"CreatedAt" json:"createdAt"`
	UpdatedAt   *time.Time `db:"UpdatedAt" json:"updatedAt,omitempty"`
}
