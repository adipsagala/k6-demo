package main

import (
	"app/config"
	"app/handlers"
	"app/helpers"
	"app/repositories"
	"app/services"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from the .env file.
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
	}

	// Initialize the database & redis connection.
	config.InitDB()
	config.InitRedis()

	// Initialize repositories, services, and handlers.
	helloHandler := handlers.NewHelloHandler()

	// Initialize the product repository, service, and handler.
	productRepository := repositories.NewProductRepository(config.DB)
	productService := services.NewProductService(productRepository, config.RedisClient)
	productHandler := handlers.NewProductHandler(productService)

	r := gin.Default()

	// route the endpoints to their respective handlers.
	r.GET("/hello", helloHandler.HelloHandler)
	r.GET("/products", productHandler.GetProducts)
	r.POST("/products", productHandler.CreateProduct)
	r.GET("/products-with-cache", productHandler.GetProductsWithCache)
	r.GET("/products-where-like", productHandler.SearchProducts)

	// Retrieve the application port from environment variables with a default value of "8080".
	appPort := helpers.GetEnv("APP_PORT", "8080")

	// Start the HTTP server on the specified port.
	r.Run(":" + appPort)
}
