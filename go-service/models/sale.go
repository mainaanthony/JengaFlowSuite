package models

import "time"

// Sale represents a sales transaction
type Sale struct {
	ID              int        `db:"Id" json:"id"`
	SaleNumber      string     `db:"SaleNumber" json:"saleNumber"`
	CustomerID      int        `db:"CustomerId" json:"customerId"`
	BranchID        int        `db:"BranchId" json:"branchId"`
	AttendantUserID int        `db:"AttendantUserId" json:"attendantUserId"`
	TotalAmount     float64    `db:"TotalAmount" json:"totalAmount"`
	PaymentMethod   string     `db:"PaymentMethod" json:"paymentMethod"`
	Status          string     `db:"Status" json:"status"`
	SaleDate        time.Time  `db:"SaleDate" json:"saleDate"`
	CreatedAt       time.Time  `db:"CreatedAt" json:"createdAt"`
	UpdatedAt       *time.Time `db:"UpdatedAt" json:"updatedAt,omitempty"`
}

// SaleItem represents an item in a sale
type SaleItem struct {
	ID         int       `db:"Id" json:"id"`
	SaleID     int       `db:"SaleId" json:"saleId"`
	ProductID  int       `db:"ProductId" json:"productId"`
	Quantity   int       `db:"Quantity" json:"quantity"`
	UnitPrice  float64   `db:"UnitPrice" json:"unitPrice"`
	TotalPrice float64   `db:"TotalPrice" json:"totalPrice"`
	Discount   *float64  `db:"Discount" json:"discount,omitempty"`
	CreatedAt  time.Time `db:"CreatedAt" json:"createdAt"`
}
