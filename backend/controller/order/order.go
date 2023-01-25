package controller

import (
	"github.com/sut65/team13/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

func CreateOrder(c *gin.Context) {
	var order entity.Order
	// var user entity.User
	var option entity.Order
	var basket entity.Basket

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Raw("SELECT * FROM order WHERE user_id = ? AND basket_id = ?", order.User_ID, order.Basket_ID).First(&order); tx.RowsAffected == 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "my order"})
		return
	}

	if tx := entity.DB().Where("id = ?", order.Basket_ID).First(&option); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "basket not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", order.Option_ID).First(&option); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "option not found"})
		return
	}

	od := entity.Order{
		User_ID:   order.User_ID,
		Basket_ID: order.Basket_ID,
		Option_ID: order.Option_ID,
		Slip:      order.Slip,
		Date:      basket.Date.Local(),
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

	if err := entity.DB().Raw("SELECT * FROM basket_id").Scan(&order).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": order})
}
