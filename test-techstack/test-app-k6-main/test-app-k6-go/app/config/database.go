// Package config handles the initialization and configurations.
// Author: Tri Wicaksono
// Website: https://triwicaksono.com
package config

import (
	"app/helpers"
	"database/sql"
	"fmt"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func InitDB() {

	var err error
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
		helpers.GetEnv("DB_USERNAME", "root"),
		helpers.GetEnv("DB_PASSWORD", "example"),
		helpers.GetEnv("DB_HOST", "db"),
		helpers.GetEnv("DB_PORT", "3306"),
		helpers.GetEnv("DB_DATABASE", "products_db"),
	)

	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		panic(err)
	}

	dbMaxOpenCon, err := strconv.Atoi(helpers.GetEnv("DB_MAX_OPEN_CONN", "50"))
	if err != nil {
		panic(fmt.Sprintf("Invalid value for DB_MAX_OPEN_CONN: %v", err))
	}

	dbMaxIdleCon, err := strconv.Atoi(helpers.GetEnv("DB_MAX_IDLE_CONN", "50"))
	if err != nil {
		panic(fmt.Sprintf("Invalid value for DB_MAX_IDLE_CONN: %v", err))
	}

	dbConnMaxLifetime, err := strconv.Atoi(helpers.GetEnv("DB_MAX_CONN_LIFE_TIME", "50"))
	if err != nil {
		panic(fmt.Sprintf("Invalid value for DB_MAX_CONN_LIFE_TIME: %v", err))
	}

	dbConnMaxIdleTime, err := strconv.Atoi(helpers.GetEnv("DB_MAX_IDLE_LIFE_TIME", "50"))
	if err != nil {
		panic(fmt.Sprintf("Invalid value for DB_MAX_IDLE_LIFE_TIME: %v", err))
	}

	DB.SetMaxOpenConns(dbMaxOpenCon)
	DB.SetMaxIdleConns(dbMaxIdleCon)
	DB.SetConnMaxLifetime(time.Duration(dbConnMaxLifetime) * time.Minute)
	DB.SetConnMaxIdleTime(time.Duration(dbConnMaxIdleTime) * time.Minute)
}
