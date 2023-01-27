package controller

import (
	"github.com/sut65/team13/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST/order
func CreateOrder(c *gin.Context) {
	var order entity.Order
	var user entity.User
	var options entity.Option

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// if tx := entity.DB().Raw("SELECT * FROM order WHERE user_id = ? AND basket_id = ?", order.User_ID, order.Basket_ID).First(&order); tx.RowsAffected == 1 {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "my order"})
	// 	return
	// }

	if tx := entity.DB().Where("id = ?", order.Option_ID).First(&options); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "option not found"})
		return
	}

	od := entity.Order{
		User:   user,
		Option: options,
		Slip:   order.Slip,
		Date:   order.Date.Local(),
	}

	if err := entity.DB().Create(&od).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	c.JSON(http.StatusOK, gin.H{"data": order})
}

// GET //order/:id
func GetOrder(c *gin.Context) {
	var order []entity.Order
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&order); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "order not found"})
		return

	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

// GET/order
func ListOrder(c *gin.Context) {
	var order []entity.Order

	if err := entity.DB().Raw("SELECT * FROM orders").Scan(&order).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": order})
}

// GET /userorder/
func ListUserOrder(c *gin.Context) {
	var order []entity.Order
	var baskets []entity.Basket

	id := c.Param("id")

	//list เฉพาะ order ของ user
	if err := entity.DB().Preload("User").Preload("Game").Preload("Payment_Status").Raw("SELECT * FROM baskets WHERE user_id = ?", id).Find(&baskets).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

// GET /userfriend/:uid
func ListUserFriend(c *gin.Context) {
	var friend []entity.Friend
	uid := c.Param("uid")
	if err := entity.DB().Preload("User").Preload("User_Friend").Raw("SELECT * FROM friends WHERE user_id = ? AND is_hide = 0", uid).Find(&friend).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": friend})
}
