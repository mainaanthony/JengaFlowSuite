package models

import "time"

// User represents a system user linked to Keycloak
type User struct {
	ID          int        `db:"Id" json:"id"`
	KeycloakID  string     `db:"KeycloakId" json:"keycloakId"`
	Username    string     `db:"Username" json:"username"`
	Email       string     `db:"Email" json:"email"`
	FirstName   string     `db:"FirstName" json:"firstName"`
	LastName    string     `db:"LastName" json:"lastName"`
	Phone       *string    `db:"Phone" json:"phone,omitempty"`
	IsActive    bool       `db:"IsActive" json:"isActive"`
	CreatedAt   time.Time  `db:"CreatedAt" json:"createdAt"`
	UpdatedAt   *time.Time `db:"UpdatedAt" json:"updatedAt,omitempty"`
	LastLoginAt *time.Time `db:"LastLoginAt" json:"lastLoginAt,omitempty"`
	BranchID    int        `db:"BranchId" json:"branchId"`
	RoleID      int        `db:"RoleId" json:"roleId"`
}
