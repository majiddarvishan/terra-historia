package database

import (
	"fmt"
	"log"
	"terra-historia/backend/config"
	"terra-historia/backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// Connect connects to the database and runs migrations
func Connect() {
	var err error
	DB, err = gorm.Open(postgres.Open(config.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	} else {
		fmt.Println("Database connection successfully opened")
	}

	fmt.Println("Running database migrations...")
	err = DB.AutoMigrate(&models.User{}, &models.Place{}, &models.Comment{})
	if err != nil {
		log.Fatal("Failed to run migrations:", err)
	}
}
