// Package helpers provides utility functions for the application.
// Author: Tri Wicaksono
// Website: https://triwicaksono.com
package helpers

import "os"

// GetEnv retrieves the value of the environment variable named by the key.
// If the environment variable is not set or is empty, it returns the provided default value.
//
// Parameters:
//   - key: The name of the environment variable to retrieve.
//   - defaultVal: The default value to return if the environment variable is not set.
//
// Returns:
//   - A string containing the value of the environment variable or the default value.
func GetEnv(key, defaultVal string) string {
	// Look up the environment variable by key.
	if value, exists := os.LookupEnv(key); exists && value != "" {
		return value
	}
	return defaultVal
}
