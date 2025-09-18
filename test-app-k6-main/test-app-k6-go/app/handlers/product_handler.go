// Package handlers provides HTTP request handlers for the application.
// Author: Tri Wicaksono
// Website: https://triwicaksono.com
package handlers

import (
	"app/helpers"
	"app/models"
	"app/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ProductHandler handles HTTP requests related to product operations.
type ProductHandler struct {
	service services.ProductService
}

// NewProductHandler creates a new instance of ProductHandler with the provided ProductService.
func NewProductHandler(service services.ProductService) *ProductHandler {
	return &ProductHandler{service}
}

// GetProducts handles the retrieval of all products.
func (h *ProductHandler) GetProducts(c *gin.Context) {
	products, err := h.service.GetProducts()
	if err != nil {
		helpers.ResponseError(c, http.StatusInternalServerError, "Failed to fetch products")
		return
	}
	helpers.ResponseSuccess(c, "Products fetched successfully", products)
}

// CreateProduct handles the creation of a new product.
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var p models.Product
	if err := c.ShouldBindJSON(&p); err != nil {
		helpers.ResponseError(c, http.StatusBadRequest, "Invalid input")
		return
	}

	result, err := h.service.CreateProduct(p)
	if err != nil {
		helpers.ResponseError(c, http.StatusInternalServerError, "Failed to create product")
		return
	}

	helpers.ResponseSuccess(c, "Product created", result)
}

// GetProductsWithCache handles the retrieval of products with caching.
func (h *ProductHandler) GetProductsWithCache(c *gin.Context) {
	// ctx := context.Background()

	products, source, err := h.service.GetProductsWithCache()

	if err != nil {
		helpers.ResponseError(c, http.StatusInternalServerError, "Failed to fetch products")
		return
	}

	if err == nil {
		helpers.ResponseSuccess(c, "Products fetched from "+source, products)
		return
	}
}

// SearchProducts handles the search for products based on a query string.
func (h *ProductHandler) SearchProducts(c *gin.Context) {
	q := c.Query("q")

	products, err := h.service.SearchProducts(q)
	if err != nil {
		helpers.ResponseError(c, http.StatusInternalServerError, "Failed to search products")
		return
	}

	helpers.ResponseSuccess(c, "Products fetched successfully", products)
}
