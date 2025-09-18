// Package handlers provides HTTP request handlers for the application.
// Author: Tri Wicaksono
// Website: https://triwicaksono.com
package handlers

import (
	"app/helpers"

	"github.com/gin-gonic/gin"
)

// HelloHandler handles HTTP requests for the hello endpoint.
type HelloHandler struct{}

// NewHelloHandler creates a new instance of HelloHandler.
func NewHelloHandler() *HelloHandler {
	return &HelloHandler{}
}

// HelloHandler responds with a simple "Hello World!" message.
func (h *HelloHandler) HelloHandler(c *gin.Context) {
	helpers.ResponseSuccess(c, "Hello World!", nil)
}
