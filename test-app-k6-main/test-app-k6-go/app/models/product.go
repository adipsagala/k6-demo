// Package models provides data models for the application.
// Author: Tri Wicaksono
// Website: https://triwicaksono.com
package models

type Product struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
