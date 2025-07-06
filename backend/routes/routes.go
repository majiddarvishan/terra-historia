package routes

import (
	"terra-historia/backend/controllers"
	"terra-historia/backend/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRouter configures the routes for the application
func SetupRouter(r *gin.Engine) {
	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
		}

		// Example of a protected route
		api.GET("/profile", middleware.RequireAuth, func(c *gin.Context) {
			user, _ := c.Get("user")
			c.JSON(200, gin.H{"message": "Welcome to your profile!", "user": user})
		})
	}
}
    