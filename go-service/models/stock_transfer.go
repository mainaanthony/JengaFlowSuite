package models

import "time"

// StockTransfer represents a stock transfer between branches
type StockTransfer struct {
	ID                int        `db:"Id" json:"id"`
	TransferNumber    string     `db:"TransferNumber" json:"transferNumber"`
	FromBranchID      int        `db:"FromBranchId" json:"fromBranchId"`
	ToBranchID        int        `db:"ToBranchId" json:"toBranchId"`
	RequestedByUserID int        `db:"RequestedByUserId" json:"requestedByUserId"`
	ApprovedByUserID  *int       `db:"ApprovedByUserId" json:"approvedByUserId,omitempty"`
	Status            string     `db:"Status" json:"status"`
	RequestedDate     time.Time  `db:"RequestedDate" json:"requestedDate"`
	CompletedDate     *time.Time `db:"CompletedDate" json:"completedDate,omitempty"`
	Notes             *string    `db:"Notes" json:"notes,omitempty"`
	CreatedAt         time.Time  `db:"CreatedAt" json:"createdAt"`
	UpdatedAt         *time.Time `db:"UpdatedAt" json:"updatedAt,omitempty"`
}

// StockTransferItem represents an item in a stock transfer
type StockTransferItem struct {
	ID                  int       `db:"Id" json:"id"`
	StockTransferID     int       `db:"StockTransferId" json:"stockTransferId"`
	ProductID           int       `db:"ProductId" json:"productId"`
	QuantityRequested   int       `db:"QuantityRequested" json:"quantityRequested"`
	QuantityTransferred *int      `db:"QuantityTransferred" json:"quantityTransferred,omitempty"`
	CreatedAt           time.Time `db:"CreatedAt" json:"createdAt"`
}
