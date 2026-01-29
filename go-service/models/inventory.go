package models

import "time"

// Inventory represents stock levels at a branch
type Inventory struct {
	ID            int        `db:"Id" json:"id"`
	ProductID     int        `db:"ProductId" json:"productId"`
	BranchID      int        `db:"BranchId" json:"branchId"`
	Quantity      int        `db:"Quantity" json:"quantity"`
	ReorderLevel  int        `db:"ReorderLevel" json:"reorderLevel"`
	MaxStockLevel int        `db:"MaxStockLevel" json:"maxStockLevel"`
	LastRestocked time.Time  `db:"LastRestocked" json:"lastRestocked"`
	CreatedAt     time.Time  `db:"CreatedAt" json:"createdAt"`
	UpdatedAt     *time.Time `db:"UpdatedAt" json:"updatedAt,omitempty"`
}
