// Package helpers provides utility functions for the application.
// Author: Tri Wicaksono
// Website: https://triwicaksono.com
package helpers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func ResponseSuccess(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, APIResponse{
		Status:  "SUCCESS",
		Message: message,
		Data:    data,
	})
}

func ResponseCreated(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusCreated, APIResponse{
		Status:  "SUCCESS",
		Message: message,
		Data:    data,
	})
}

func ResponseError(c *gin.Context, code int, message string) {
	c.JSON(code, APIResponse{
		Status:  "ERROR",
		Message: message,
	})
}
