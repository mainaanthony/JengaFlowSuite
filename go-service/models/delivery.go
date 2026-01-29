package models

import "time"

// Delivery represents a delivery order
type Delivery struct {
	ID              int        `db:"Id" json:"id"`
	DeliveryNumber  string     `db:"DeliveryNumber" json:"deliveryNumber"`
	SaleID          *int       `db:"SaleId" json:"saleId,omitempty"`
	CustomerID      int        `db:"CustomerId" json:"customerId"`
	DriverID        int        `db:"DriverId" json:"driverId"`
	DeliveryAddress string     `db:"DeliveryAddress" json:"deliveryAddress"`
	ContactPhone    *string    `db:"ContactPhone" json:"contactPhone,omitempty"`
	Status          string     `db:"Status" json:"status"`
	Priority        string     `db:"Priority" json:"priority"`
	ScheduledDate   time.Time  `db:"ScheduledDate" json:"scheduledDate"`
	DeliveredDate   *time.Time `db:"DeliveredDate" json:"deliveredDate,omitempty"`
	Notes           *string    `db:"Notes" json:"notes,omitempty"`
	CreatedAt       time.Time  `db:"CreatedAt" json:"createdAt"`
	UpdatedAt       *time.Time `db:"UpdatedAt" json:"updatedAt,omitempty"`
}

// DeliveryItem represents an item in a delivery
type DeliveryItem struct {
	ID         int       `db:"Id" json:"id"`
	DeliveryID int       `db:"DeliveryId" json:"deliveryId"`
	ProductID  int       `db:"ProductId" json:"productId"`
	Quantity   int       `db:"Quantity" json:"quantity"`
	CreatedAt  time.Time `db:"CreatedAt" json:"createdAt"`
}
