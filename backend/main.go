package main

import (
	basket_controller "github.com/sut65/team13/controller/basket"
	payment_status_controller "github.com/sut65/team13/controller/basket"
	user_controller "github.com/sut65/team13/controller/user"

	"github.com/sut65/team13/entity"

	"github.com/gin-gonic/gin"
)

func main() {

	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	// User Routes

	r.GET("/users", user_controller.ListUsers)
	r.GET("/user/:id", user_controller.GetUser)
	r.POST("/users", user_controller.CreateUser)
	r.PATCH("/users", user_controller.UpdateUser)
	r.DELETE("/users/:id", user_controller.DeleteUser)

	r.GET("/genders", user_controller.ListGenders)
	r.GET("/gender/:id", user_controller.GetGender)

	// Basket Routes
	r.GET("/payment_status", payment_status_controller.ListPayment_Status)

	r.GET("/baskets", basket_controller.ListBasket)
	r.GET("/basket/:id", basket_controller.GetBasket)
	r.POST("/baskets", basket_controller.CraeteBasket)
	r.PATCH("/baskets", basket_controller.UpdateBasket)
	r.DELETE("/basket/:id", basket_controller.DeleteBasket)

	// Run the server

	r.Run()

}

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")

		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}
