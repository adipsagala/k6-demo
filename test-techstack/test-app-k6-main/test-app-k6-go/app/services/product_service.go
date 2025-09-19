// Package services provides business logic and service layer for the application.
// Author: Tri Wicaksono
// Website: https://triwicaksono.com
package services

import (
	"app/helpers"
	"app/models"
	"app/repositories"
	"context"
	"encoding/json"
	"errors"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

// ProductService defines the interface for product-related operations.
type ProductService interface {
	GetProducts() ([]models.Product, error)
	CreateProduct(p models.Product) (product models.Product, err error)
	GetProductsWithCache() (products []models.Product, source string, err error)
	SearchProducts(query string) ([]models.Product, error)
}

// productService implements the ProductService interface and interacts with the ProductRepository.
type productService struct {
	repository  repositories.ProductRepository
	RedisClient *redis.Client
}

// NewProductService creates a new instance of ProductService with the provided ProductRepository and Redis client.
func NewProductService(repo repositories.ProductRepository, redisClient *redis.Client) ProductService {
	return &productService{
		repository:  repo,
		RedisClient: redisClient,
	}
}

// GetProducts retrieves all products from the repository.
func (s *productService) GetProducts() ([]models.Product, error) {
	return s.repository.GetAllProducts()
}

// CreateProduct creates a new product in the repository.
func (s *productService) CreateProduct(p models.Product) (product models.Product, err error) {
	return s.repository.CreateProduct(p)
}

// GetProductsWithCache retrieves all products, first checking the cache and then the database if not found.
func (s *productService) GetProductsWithCache() (products []models.Product, source string, err error) {
	var errMessage error
	cacheKey := helpers.GetEnv("CACHE_KEY_PRODUCTS", "products")

	// Attempt to fetch products from cache
	products, err = s.getCachedProducts(cacheKey)
	if err == nil {
		log.Println("Products fetched from cache")
		return products, "cache", nil
	}

	// If cache miss, fetch products from database
	products, err = s.repository.GetAllProducts()
	if err != nil {
		errMessage = errors.New("failed to fetch products from database, err: " + err.Error())
		log.Println(errMessage)
		return nil, "", errMessage
	}

	// Store the products in cache for future requests
	if err := s.storeCacheProducts(cacheKey, products); err != nil {
		errMessage = errors.New("failed storing products in cache, err: " + err.Error())
		log.Println(errMessage)
	}

	log.Println("Products fetched from database")
	return products, "database", nil
}

// SearchProducts searches for products based on a query string.
func (s *productService) SearchProducts(query string) ([]models.Product, error) {

	products, err := s.repository.SearchProducts(query)
	if err != nil {
		log.Println("Error fetching products:", err)
		return nil, err
	}

	return products, nil
}

// getCachedProducts retrieves products from the cache using the provided cache key.
func (s *productService) getCachedProducts(cacheKey string) ([]models.Product, error) {

	val, err := s.RedisClient.Get(context.Background(), cacheKey).Result()
	if err != nil {
		return nil, err
	}

	var products []models.Product
	if err := json.Unmarshal([]byte(val), &products); err != nil {
		return nil, err
	}

	return products, nil
}

// storeCacheProducts stores the provided products in the cache with the specified cache key.
func (s *productService) storeCacheProducts(cacheKey string, products []models.Product) error {
	data, err := json.Marshal(products)
	if err != nil {
		return err
	}

	return s.RedisClient.Set(context.Background(), cacheKey, data, 60*time.Second).Err()
}
