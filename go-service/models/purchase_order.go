package models

import "time"

// PurchaseOrder represents a purchase order to a supplier
type PurchaseOrder struct {
	ID                   int        `db:"Id" json:"id"`
	PONumber             string     `db:"PONumber" json:"poNumber"`
	SupplierID           int        `db:"SupplierId" json:"supplierId"`
	CreatedByUserID      int        `db:"CreatedByUserId" json:"createdByUserId"`
	ApprovedByUserID     *int       `db:"ApprovedByUserId" json:"approvedByUserId,omitempty"`
	TotalAmount          float64    `db:"TotalAmount" json:"totalAmount"`
	Status               string     `db:"Status" json:"status"`
	ExpectedDeliveryDate time.Time  `db:"ExpectedDeliveryDate" json:"expectedDeliveryDate"`
	DeliveredDate        *time.Time `db:"DeliveredDate" json:"deliveredDate,omitempty"`
	Notes                *string    `db:"Notes" json:"notes,omitempty"`
	CreatedAt            time.Time  `db:"CreatedAt" json:"createdAt"`
	UpdatedAt            *time.Time `db:"UpdatedAt" json:"updatedAt,omitempty"`
}

// PurchaseOrderItem represents an item in a purchase order
type PurchaseOrderItem struct {
	ID              int       `db:"Id" json:"id"`
	PurchaseOrderID int       `db:"PurchaseOrderId" json:"purchaseOrderId"`
	ProductID       int       `db:"ProductId" json:"productId"`
	Quantity        int       `db:"Quantity" json:"quantity"`
	UnitPrice       float64   `db:"UnitPrice" json:"unitPrice"`
	TotalPrice      float64   `db:"TotalPrice" json:"totalPrice"`
	CreatedAt       time.Time `db:"CreatedAt" json:"createdAt"`
}
