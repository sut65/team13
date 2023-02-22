package main

import (
	admin_controller "github.com/sut65/team13/controller/admin"
	banner_controller "github.com/sut65/team13/controller/banner"
	basket_controller "github.com/sut65/team13/controller/basket"
	friend_controller "github.com/sut65/team13/controller/friend"
	game_controller "github.com/sut65/team13/controller/game"
	login_controller "github.com/sut65/team13/controller/login"
	order_controller "github.com/sut65/team13/controller/order"
	payment_ver_controller "github.com/sut65/team13/controller/payment_ver"
	review_controller "github.com/sut65/team13/controller/review"
	storage_controller "github.com/sut65/team13/controller/storage"
	topgame_controller "github.com/sut65/team13/controller/topgame"
	user_controller "github.com/sut65/team13/controller/user"
	wishlist_controller "github.com/sut65/team13/controller/wishlist"
	"github.com/sut65/team13/entity"
	middlewares "github.com/sut65/team13/middlewares"

	"github.com/gin-gonic/gin"
)

func main() {

	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	// login User Route
	r.POST("/login/user", login_controller.LoginUser)
	r.POST("/users", user_controller.CreateUser)
	r.GET("/genders", user_controller.ListGenders)

	// login Admin Route
	r.POST("/login/admin", login_controller.LoginAdmin)

	router := r.Group("/")
	{
		protected := router.Use(middlewares.Authorizes())
		{
			// User Routes
			protected.GET("/users", user_controller.ListUsers)
			protected.GET("/user/:email", user_controller.GetUser)
			protected.PATCH("/users", user_controller.UpdateUser)
			protected.DELETE("/users/:email", user_controller.DeleteUser)

			protected.GET("/sellers", user_controller.ListSellers)
			protected.GET("/user_storage/:email", user_controller.ListUserStorages)
			protected.GET("/user_game/:email", user_controller.ListUserGames)

			// Basket Routes
			protected.GET("/payment_status", basket_controller.ListPayment_Status)

			protected.GET("/baskets", basket_controller.ListBasket)
			protected.GET("/basket/:id", basket_controller.GetBasket)
			protected.GET("/userbasket/:uid", basket_controller.GetUserBasket)
			protected.GET("/userbasketfororder/:uid", basket_controller.GetUserBasketForOrder)

			protected.POST("/baskets", basket_controller.CraeteBasket)
			protected.PATCH("/baskets", basket_controller.UpdateBasket)
			protected.DELETE("/basket/:id", basket_controller.DeleteBasket)

			// Friend Routes
			protected.GET("/intimates", friend_controller.ListIntimate)

			protected.GET("/friends", friend_controller.ListFriend)
			protected.GET("/friend/:id", friend_controller.GetFriend)
			protected.GET("/userfriend/:uid", friend_controller.GetUserfriend)
			protected.GET("/hideuserfriend/:uid", friend_controller.GetHideUserfriend)
			protected.POST("/friends", friend_controller.CraeteFriend)
			protected.PATCH("/friends", friend_controller.UpdateFriend)
			protected.DELETE("/friend/:id", friend_controller.DeleteFriend)

			protected.GET("/userforaddfriend/:uid", user_controller.GetUserForAddFriend)
			// Game Routes
			protected.GET("/Game", game_controller.ListGames)
			protected.GET("/Game/:id", game_controller.GetGame)
			protected.GET("/Game_file/:id", game_controller.GetGamefile)
			protected.POST("/Game", game_controller.CreateGame)
			protected.PATCH("/Game", game_controller.UpdateGame)
			protected.DELETE("/Game/:id", game_controller.DeleteGame)

			protected.GET("/Individual_Game/:id", game_controller.GetIndividualGame)
			protected.GET("/ALLGame", game_controller.ListALLGames) // เอาตัวที่ถูกลบแล้วขึ้นมาด้วย

			protected.GET("/Rating", game_controller.ListRating)
			protected.GET("/Rating/:id", game_controller.GetRating)

			protected.GET("/Status", game_controller.ListGame_status)
			protected.GET("/Status/:id", game_controller.GetGame_status)

			protected.GET("/Game_Type", game_controller.ListGame_type)
			protected.GET("/Game_Type/:id", game_controller.GetGame_type)

			// Storage Routes
			protected.POST("/storages", storage_controller.CreateStroage)
			protected.GET("/storages", storage_controller.ListStorages)
			protected.GET("/storages/:id", storage_controller.ListStoragesUser)
			protected.PATCH("/storages", storage_controller.UpdateStorage)
			protected.DELETE("/storages/:id", storage_controller.DeleteStorage)

			protected.GET("/ALLstorages", storage_controller.ListALLStorages) // เอาตัวที่ถูกลบแล้วขึ้นมาด้วย

			protected.GET("/collections/:id", storage_controller.ListCollections)
			protected.POST("/collections", storage_controller.CreateCollection)
			protected.PATCH("/collections", storage_controller.UpdateCollection)
			protected.DELETE("/collections/:id", storage_controller.DeleteCollection)
			// Banner Routes
			protected.GET("/banners", banner_controller.ListBanners)
			protected.GET("/banner/:id", banner_controller.GetBanner)
			protected.POST("/banners", banner_controller.CreateBanner)
			protected.PATCH("/banners", banner_controller.UpdateBanner)
			protected.DELETE("/banner/:id", banner_controller.DeleteBanner)
			// Admin Routes
			protected.GET("/admin", admin_controller.ListAdmin)
			protected.GET("/admin/:email", admin_controller.GetAdmin)
			protected.POST("/admin", admin_controller.CreateAdmin)
			protected.PATCH("/admin", admin_controller.UpdateAdmin)
			protected.DELETE("/admin/:id", admin_controller.DeleteAdmin)
			protected.GET("/Department", admin_controller.ListDepartment)
			protected.GET("/Province", admin_controller.ListProvince)
			//Order Routes
			protected.GET("/order", order_controller.ListOrder)
			protected.GET("/order/:id", order_controller.GetOrder)
			protected.POST("/order/:id", order_controller.CreateOrder)

			protected.GET("/userorder/:uid", order_controller.ListUserOrder)
			protected.GET("/userfriend/", order_controller.ListUserFriend)

			protected.PATCH("/order", order_controller.UpdateOrder)
			//Payment_Ver Routes
			protected.GET("/Verification_Status", payment_ver_controller.ListVerification_Status)

			protected.GET("/payment_ver", payment_ver_controller.ListPaymentVer)
			protected.GET("/payment_ver/:id", payment_ver_controller.GetPaymentVer)
			protected.POST("/payment_ver", payment_ver_controller.CreatePaymentVer)

			protected.PATCH("/payments_ver", payment_ver_controller.UpdatePaymentVer)

			// Wishlist Routes
			protected.POST("/wishlists", wishlist_controller.CreateWishlist)
			protected.GET("/wishlists/:id", wishlist_controller.ListWishlists)
			protected.PATCH("/wishlists", wishlist_controller.UpdateWishlist)
			protected.DELETE("/wishlists/:id", wishlist_controller.DeleteWishlist)

			protected.GET("/wish_levels", wishlist_controller.ListWish_Level)

			//review Router
			protected.POST("/reviews", review_controller.CreateReview)
			protected.GET("/reviews", review_controller.GetReview)
			protected.GET("/review", review_controller.ListReviews)
			protected.PATCH("/reviews", review_controller.UpdateReview)
			protected.DELETE("/review/:id", review_controller.DeleteReview)

			protected.GET("/stars", review_controller.ListStars)

			//topgame Router
			protected.POST("/topgames", topgame_controller.CreateTopgame)
			protected.GET("/topgames", topgame_controller.GetTopgame)
			protected.GET("/topgame", topgame_controller.ListTopgames)
			protected.PATCH("/topgames", topgame_controller.UpdateTopgame)
			protected.DELETE("/topgame/:id", topgame_controller.DeleteTopgame)

			protected.GET("/rankings", topgame_controller.ListRankings)

		}
	}
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
