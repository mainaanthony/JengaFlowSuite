package models

import "time"

// GoodsReceivedNote represents a GRN for received goods
type GoodsReceivedNote struct {
	ID               int       `db:"Id" json:"id"`
	GRNNumber        string    `db:"GRNNumber" json:"grnNumber"`
	PurchaseOrderID  int       `db:"PurchaseOrderId" json:"purchaseOrderId"`
	ReceivedByUserID int       `db:"ReceivedByUserId" json:"receivedByUserId"`
	ReceivedDate     time.Time `db:"ReceivedDate" json:"receivedDate"`
	Notes            *string   `db:"Notes" json:"notes,omitempty"`
	Status           string    `db:"Status" json:"status"`
	CreatedAt        time.Time `db:"CreatedAt" json:"createdAt"`
}

// GoodsReceivedNoteItem represents an item in a GRN
type GoodsReceivedNoteItem struct {
	ID                  int       `db:"Id" json:"id"`
	GoodsReceivedNoteID int       `db:"GoodsReceivedNoteId" json:"goodsReceivedNoteId"`
	ProductID           int       `db:"ProductId" json:"productId"`
	QuantityOrdered     int       `db:"QuantityOrdered" json:"quantityOrdered"`
	QuantityReceived    int       `db:"QuantityReceived" json:"quantityReceived"`
	Remarks             *string   `db:"Remarks" json:"remarks,omitempty"`
	CreatedAt           time.Time `db:"CreatedAt" json:"createdAt"`
}
