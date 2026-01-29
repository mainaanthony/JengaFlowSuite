package models

import "time"

// Product represents a product in the inventory
type Product struct {
	ID          int        `db:"Id" json:"id"`
	Name        string     `db:"Name" json:"name"`
	SKU         string     `db:"SKU" json:"sku"`
	Brand       *string    `db:"Brand" json:"brand,omitempty"`
	CategoryID  *int       `db:"CategoryId" json:"categoryId,omitempty"`
	Price       float64    `db:"Price" json:"price"`
	Description *string    `db:"Description" json:"description,omitempty"`
	IsActive    bool       `db:"IsActive" json:"isActive"`
	CreatedAt   time.Time  `db:"CreatedAt" json:"createdAt"`
	UpdatedAt   *time.Time `db:"UpdatedAt" json:"updatedAt,omitempty"`
}
