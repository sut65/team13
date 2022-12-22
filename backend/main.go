package main

import (
	user_controller "github.com/sut65/team13/controller/user"

	"github.com/sut65/team13/entity"

	"github.com/gin-gonic/gin"
)

func main() {

	entity.SetupDatabase()

	r := gin.Default()

	// User Routes

	r.GET("/users", user_controller.ListUsers)
	r.GET("/user/:id", user_controller.GetUser)
	r.POST("/users", user_controller.CreateUser)
	r.PATCH("/users", user_controller.UpdateUser)
	r.DELETE("/users/:id", user_controller.DeleteUser)

	// Run the server

	r.Run()

}
