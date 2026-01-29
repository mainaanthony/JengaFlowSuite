package models

import "time"

// TaxReturn represents a tax return submission
type TaxReturn struct {
	ID                int        `db:"Id" json:"id"`
	Period            string     `db:"Period" json:"period"`
	TaxType           string     `db:"TaxType" json:"taxType"`
	Amount            float64    `db:"Amount" json:"amount"`
	Status            string     `db:"Status" json:"status"`
	DueDate           time.Time  `db:"DueDate" json:"dueDate"`
	SubmittedDate     *time.Time `db:"SubmittedDate" json:"submittedDate,omitempty"`
	SubmittedByUserID *int       `db:"SubmittedByUserId" json:"submittedByUserId,omitempty"`
	ReferenceNumber   *string    `db:"ReferenceNumber" json:"referenceNumber,omitempty"`
	CreatedAt         time.Time  `db:"CreatedAt" json:"createdAt"`
	UpdatedAt         *time.Time `db:"UpdatedAt" json:"updatedAt,omitempty"`
}
