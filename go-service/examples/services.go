// Package examples demonstrates how to use the models and database package
package examples

import (
	"context"
	"log"
	"time"

	"example.com/go-service/database"
	"example.com/go-service/models"
)

// UserService demonstrates how to interact with User data
type UserService struct {
	repo *database.Repository
}

// NewUserService creates a new user service
func NewUserService(db *database.DB) *UserService {
	return &UserService{
		repo: database.NewRepository(db),
	}
}

// GetUserByID fetches a user by ID
func (s *UserService) GetUserByID(ctx context.Context, userID int) (*models.User, error) {
	query := `
		SELECT 
			Id, KeycloakId, Username, Email, FirstName, LastName, 
			Phone, IsActive, CreatedAt, UpdatedAt, LastLoginAt, 
			BranchId, RoleId
		FROM jengaFlow.Users 
		WHERE Id = @p1
	`

	var user models.User
	err := s.repo.QueryRow(ctx, query, userID).Scan(
		&user.ID,
		&user.KeycloakID,
		&user.Username,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Phone,
		&user.IsActive,
		&user.CreatedAt,
		&user.UpdatedAt,
		&user.LastLoginAt,
		&user.BranchID,
		&user.RoleID,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

// InventoryService demonstrates inventory operations
type InventoryService struct {
	repo *database.Repository
}

// NewInventoryService creates a new inventory service
func NewInventoryService(db *database.DB) *InventoryService {
	return &InventoryService{
		repo: database.NewRepository(db),
	}
}

// GetLowStockItems returns items below reorder level
func (i *InventoryService) GetLowStockItems(ctx context.Context) ([]models.Inventory, error) {
	query := `
		SELECT 
			Id, ProductId, BranchId, Quantity, ReorderLevel, 
			MaxStockLevel, LastRestocked, CreatedAt, UpdatedAt
		FROM jengaFlow.Inventory 
		WHERE Quantity <= ReorderLevel
		ORDER BY Quantity ASC
	`

	rows, err := i.repo.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.Inventory
	for rows.Next() {
		var item models.Inventory
		err := rows.Scan(
			&item.ID,
			&item.ProductID,
			&item.BranchID,
			&item.Quantity,
			&item.ReorderLevel,
			&item.MaxStockLevel,
			&item.LastRestocked,
			&item.CreatedAt,
			&item.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	return items, rows.Err()
}

// SalesService demonstrates sales operations
type SalesService struct {
	repo *database.Repository
}

// NewSalesService creates a new sales service
func NewSalesService(db *database.DB) *SalesService {
	return &SalesService{
		repo: database.NewRepository(db),
	}
}

// GetDailySalesReport generates a daily sales report for a branch
func (s *SalesService) GetDailySalesReport(ctx context.Context, date time.Time, branchID int) (map[string]interface{}, error) {
	query := `
		SELECT 
			COUNT(*) as TotalTransactions,
			ISNULL(SUM(TotalAmount), 0) as TotalRevenue,
			ISNULL(AVG(TotalAmount), 0) as AverageSaleValue,
			COUNT(DISTINCT CustomerId) as UniqueCustomers
		FROM jengaFlow.Sales
		WHERE CAST(SaleDate AS DATE) = CAST(@p1 AS DATE)
		AND BranchId = @p2
		AND Status = 'Completed'
	`

	var (
		totalTransactions int
		totalRevenue      float64
		avgSaleValue      float64
		uniqueCustomers   int
	)

	err := s.repo.QueryRow(ctx, query, date, branchID).Scan(
		&totalTransactions,
		&totalRevenue,
		&avgSaleValue,
		&uniqueCustomers,
	)

	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"date":              date.Format("2006-01-02"),
		"totalTransactions": totalTransactions,
		"totalRevenue":      totalRevenue,
		"averageSaleValue":  avgSaleValue,
		"uniqueCustomers":   uniqueCustomers,
	}, nil
}

// RunExamples demonstrates using the service functions
func RunExamples() {
	log.Println("Connecting to database...")
	config := database.LoadConfigFromEnv()
	db, err := database.NewDB(config)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	ctx := context.Background()

	// Example 1: User operations
	log.Println("\n=== User Service Examples ===")
	userService := NewUserService(db)

	user, err := userService.GetUserByID(ctx, 1)
	if err != nil {
		log.Printf("Error fetching user: %v (this is expected if no data exists yet)", err)
	} else {
		log.Printf("Found user: %s %s (%s)", user.FirstName, user.LastName, user.Email)
	}

	// Example 2: Inventory operations
	log.Println("\n=== Inventory Service Examples ===")
	inventoryService := NewInventoryService(db)

	lowStock, err := inventoryService.GetLowStockItems(ctx)
	if err != nil {
		log.Printf("Error fetching low stock items: %v", err)
	} else {
		log.Printf("Found %d items below reorder level", len(lowStock))
	}

	// Example 3: Sales operations
	log.Println("\n=== Sales Service Examples ===")
	salesService := NewSalesService(db)

	today := time.Now()
	report, err := salesService.GetDailySalesReport(ctx, today, 1)
	if err != nil {
		log.Printf("Error generating sales report: %v", err)
	} else {
		log.Printf("Daily Sales Report: %+v", report)
	}

	log.Println("\n=== All examples completed successfully ===")
}
