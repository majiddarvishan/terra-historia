package main

import (
	"fmt"
	"terra-historia/backend/config"
	"terra-historia/backend/database"
	"terra-historia/backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load environment variables
	config.Load()

	// Connect to the database
	database.Connect()

	// Set up the Gin router
	r := gin.Default()

	// Simple CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Setup routes
	routes.SetupRouter(r)

	// Start the server
	fmt.Printf("Server is running on port %d\n", config.APIPort)
	r.Run(fmt.Sprintf(":%d", config.APIPort))
}