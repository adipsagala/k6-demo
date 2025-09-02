package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
)

var jwtKey = []byte("my_secret_key")

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type Item struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

type APIResponse struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

var users = map[string]string{}
var items = map[string]Item{}

func writeJSON(w http.ResponseWriter, statusCode int, status string, message string, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(APIResponse{
		Status:  strings.ToUpper(status),
		Message: message,
		Data:    data,
	})
}

// ============ AUTH ============

func Register(w http.ResponseWriter, r *http.Request) {
	var u User
	json.NewDecoder(r.Body).Decode(&u)

	if strings.TrimSpace(u.Username) == "" || strings.TrimSpace(u.Password) == "" {
		writeJSON(w, http.StatusBadRequest, "invalid", "Username and password are required", nil)
		return
	}

	if _, exists := users[u.Username]; exists {
		writeJSON(w, http.StatusBadRequest, "invalid", "User already exists", nil)
		return
	}

	users[u.Username] = u.Password
	writeJSON(w, http.StatusCreated, "success", "User registered", nil)
}

func Login(w http.ResponseWriter, r *http.Request) {
	var u User
	json.NewDecoder(r.Body).Decode(&u)

	if strings.TrimSpace(u.Username) == "" || strings.TrimSpace(u.Password) == "" {
		writeJSON(w, http.StatusBadRequest, "invalid", "Username and password are required", nil)
		return
	}

	if pass, ok := users[u.Username]; !ok || pass != u.Password {
		writeJSON(w, http.StatusUnauthorized, "error", "Invalid credentials", nil)
		return
	}

	exp := time.Now().Add(5 * time.Minute)
	claims := &Claims{
		Username: u.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(exp),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, _ := token.SignedString(jwtKey)

	writeJSON(w, http.StatusOK, "success", "Login successful", map[string]string{"token": tokenStr})
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenStr := r.Header.Get("Authorization")
		if tokenStr == "" {
			writeJSON(w, http.StatusUnauthorized, "unauthorized", "Missing token", nil)
			return
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			writeJSON(w, http.StatusUnauthorized, "unauthorized", "Invalid token", nil)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// ============ HANDLERS ============

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, "success", "Service is healthy", nil)
}

func GetItems(w http.ResponseWriter, r *http.Request) {
	var result []Item
	for _, item := range items {
		result = append(result, item)
	}
	writeJSON(w, http.StatusOK, "success", "Fetched items", result)
}

func CreateItem(w http.ResponseWriter, r *http.Request) {
	var item Item
	json.NewDecoder(r.Body).Decode(&item)

	if strings.TrimSpace(item.ID) == "" || strings.TrimSpace(item.Title) == "" {
		writeJSON(w, http.StatusBadRequest, "invalid", "Item ID and Title are required", nil)
		return
	}

	items[item.ID] = item
	writeJSON(w, http.StatusCreated, "success", "Item created", item)
}

func UpdateItem(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	if _, exists := items[id]; !exists {
		writeJSON(w, http.StatusNotFound, "invalid", "Item not found", nil)
		return
	}

	var updated Item
	json.NewDecoder(r.Body).Decode(&updated)

	if strings.TrimSpace(updated.Title) == "" {
		writeJSON(w, http.StatusBadRequest, "invalid", "Item title is required", nil)
		return
	}

	updated.ID = id
	items[id] = updated
	writeJSON(w, http.StatusOK, "success", "Item updated", updated)
}

func DeleteItem(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	if _, exists := items[id]; !exists {
		writeJSON(w, http.StatusNotFound, "invalid", "Item not found", nil)
		return
	}
	delete(items, id)
	writeJSON(w, http.StatusOK, "success", "Item deleted", nil)
}

// ============ MAIN ============

func seedSampleData() {
	items["1"] = Item{ID: "1", Title: "First Book"}
	items["2"] = Item{ID: "2", Title: "Second Item"}
	items["3"] = Item{ID: "3", Title: "GoLang Guide"}
}

func main() {
	seedSampleData()

	r := mux.NewRouter()
	r.HandleFunc("/healthcheck", HealthCheck).Methods("GET")
	r.HandleFunc("/register", Register).Methods("POST")
	r.HandleFunc("/login", Login).Methods("POST")

	api := r.PathPrefix("/items").Subrouter()
	api.Use(AuthMiddleware)
	api.HandleFunc("", GetItems).Methods("GET")
	api.HandleFunc("", CreateItem).Methods("POST")
	api.HandleFunc("/{id}", UpdateItem).Methods("PUT")
	api.HandleFunc("/{id}", DeleteItem).Methods("DELETE")

	fmt.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
