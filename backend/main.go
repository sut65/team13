package main

import (
	basket_controller "github.com/sut65/team13/controller/basket"
	friend_controller "github.com/sut65/team13/controller/friend"
	game_controller "github.com/sut65/team13/controller/game"
	login_user_controller "github.com/sut65/team13/controller/login_user"
	user_controller "github.com/sut65/team13/controller/user"
	"github.com/sut65/team13/entity"

	"github.com/gin-gonic/gin"
)

func main() {

	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	// login User Route
	r.POST("/login", login_user_controller.Login)

	// User Routes

	r.GET("/users", user_controller.ListUsers)
	r.GET("/user/:email", user_controller.GetUser)
	r.POST("/users", user_controller.CreateUser)
	r.PATCH("/users", user_controller.UpdateUser)
	r.DELETE("/users/:email", user_controller.DeleteUser)

	r.GET("/genders", user_controller.ListGenders)
	r.GET("/gender/:id", user_controller.GetGender)

	r.GET("/user_storage/:email", user_controller.ListUserStorages)
	r.GET("/user_game/:email", user_controller.ListUserGames)

	// Basket Routes
	r.GET("/payment_status", basket_controller.ListPayment_Status)

	r.GET("/baskets", basket_controller.ListBasket)
	r.GET("/basket/:id", basket_controller.GetBasket)
	r.POST("/baskets", basket_controller.CraeteBasket)
	r.PATCH("/baskets", basket_controller.UpdateBasket)
	r.DELETE("/basket/:id", basket_controller.DeleteBasket)

	// Friend
	r.GET("/Is_Hide", friend_controller.ListIs_Hide)

	r.GET("/Intimate", friend_controller.ListIntimate)

	// Game Routes
	r.GET("/Game", game_controller.ListGames)
	r.GET("/Game/:id", game_controller.GetGame)
	r.POST("/Game", game_controller.CreateGame)
	r.PATCH("/Game", game_controller.UpdateGame)
	r.DELETE("/Game/:id", game_controller.DeleteGame)

	r.GET("/Rating", game_controller.ListRating)
	r.GET("/Rating/:id", game_controller.GetRating)

	r.GET("/Status", game_controller.ListGame_status)
	r.GET("/Status/:id", game_controller.GetGame_status)

	r.GET("/Game_Type", game_controller.ListGame_type)
	r.GET("/Game_Type/:id", game_controller.GetGame_type)

	// Run the server

	r.Run()

}

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")

		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}
