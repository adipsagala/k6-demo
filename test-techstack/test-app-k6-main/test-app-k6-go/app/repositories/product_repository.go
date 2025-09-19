// Package repositories provides data access and manipulation functions for the application.
// Author: Tri Wicaksono
// Website: https://triwicaksono.com
package repositories

import (
	"app/models"
	"database/sql"
	"strings"
)

// ProductRepository defines the interface for product-related database operations.
type ProductRepository interface {
	GetAllProducts() ([]models.Product, error)
	CreateProduct(p models.Product) (product models.Product, err error)
	SearchProducts(q string) ([]models.Product, error)
}

// contactRepository implements the ProductRepository interface and interacts with the database.
type contactRepository struct {
	DB *sql.DB
}

// NewProductRepository creates a new instance of ProductRepository with the provided database connection.
func NewProductRepository(dB *sql.DB) ProductRepository {
	return &contactRepository{
		DB: dB,
	}
}

// GetAllProducts retrieves all products from the database.
func (r *contactRepository) GetAllProducts() ([]models.Product, error) {
	rows, err := r.DB.Query("SELECT id, name FROM products limit 10")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next() {
		var p models.Product
		if err := rows.Scan(&p.ID, &p.Name); err != nil {
			return nil, err
		}
		products = append(products, p)
	}
	return products, nil
}

// CreateProduct adds a new product to the database.
func (r *contactRepository) CreateProduct(p models.Product) (product models.Product, err error) {
	result, err := r.DB.Exec("INSERT INTO products (name) VALUES (?)", p.Name)
	if err != nil {
		return product, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return product, err
	}

	product = models.Product{
		ID:   int(id),
		Name: p.Name,
	}
	return product, nil
}

// SearchProducts retrieves products from the database that match the search query.
func (r *contactRepository) SearchProducts(q string) ([]models.Product, error) {
	q = "%" + strings.TrimSpace(q) + "%"
	rows, err := r.DB.Query("SELECT id, name FROM products WHERE name LIKE ? limit 10", q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next() {
		var p models.Product
		if err := rows.Scan(&p.ID, &p.Name); err != nil {
			return nil, err
		}
		products = append(products, p)
	}
	return products, nil
}
