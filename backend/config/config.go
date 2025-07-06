package config

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

var (
	// DatabaseURL is the connection string for the database
	DatabaseURL = ""
	// APIPort is the port the server will run on
	APIPort = 0
	// JWTSecret is the secret key for signing JWT tokens
	JWTSecret []byte
)

// Load loads environment variables from .env file
func Load() {
	var err error

	if err = godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	APIPort, err = strconv.Atoi(os.Getenv("API_PORT"))
	if err != nil {
		APIPort = 8080 // Default port
	}

	JWTSecret = []byte(os.Getenv("JWT_SECRET"))

	DatabaseURL = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)
}
