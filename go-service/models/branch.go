package models

import "time"

// Branch represents a physical branch/location
type Branch struct {
	ID        int        `db:"Id" json:"id"`
	Name      string     `db:"Name" json:"name"`
	Code      string     `db:"Code" json:"code"`
	Address   *string    `db:"Address" json:"address,omitempty"`
	City      *string    `db:"City" json:"city,omitempty"`
	Phone     *string    `db:"Phone" json:"phone,omitempty"`
	Email     *string    `db:"Email" json:"email,omitempty"`
	IsActive  bool       `db:"IsActive" json:"isActive"`
	CreatedAt time.Time  `db:"CreatedAt" json:"createdAt"`
	UpdatedAt *time.Time `db:"UpdatedAt" json:"updatedAt,omitempty"`
}
