package database

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

// Repository provides common database operations
type Repository struct {
	db *DB
}

// NewRepository creates a new repository instance
func NewRepository(db *DB) *Repository {
	return &Repository{db: db}
}

// QueryRow executes a query that returns a single row
func (r *Repository) QueryRow(ctx context.Context, query string, args ...interface{}) *sql.Row {
	return r.db.QueryRowContext(ctx, query, args...)
}

// Query executes a query that returns multiple rows
func (r *Repository) Query(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error) {
	return r.db.QueryContext(ctx, query, args...)
}

// Exec executes a query without returning rows
func (r *Repository) Exec(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	return r.db.ExecContext(ctx, query, args...)
}

// WithTransaction executes a function within a database transaction
func (r *Repository) WithTransaction(ctx context.Context, fn func(*sql.Tx) error) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback()
			panic(p)
		}
	}()

	if err := fn(tx); err != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			return fmt.Errorf("error rolling back transaction: %v (original error: %w)", rbErr, err)
		}
		return err
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

// BuildWhereClause helps build SQL WHERE clauses with proper parameter handling
func BuildWhereClause(conditions map[string]interface{}) (string, []interface{}) {
	if len(conditions) == 0 {
		return "", nil
	}

	where := " WHERE "
	args := make([]interface{}, 0, len(conditions))
	i := 1

	for key, value := range conditions {
		if i > 1 {
			where += " AND "
		}
		where += fmt.Sprintf("%s = @p%d", key, i)
		args = append(args, value)
		i++
	}

	return where, args
}

// FormatDateForSQL formats a time.Time for SQL Server
func FormatDateForSQL(t time.Time) string {
	return t.Format("2006-01-02 15:04:05")
}
