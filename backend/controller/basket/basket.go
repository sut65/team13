package controller

import (
	"fmt"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/sut65/team13/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

type BasketValid struct {
	User_ID           *uint
	Game_ID           *uint
	Payment_Status_ID *uint
	Note              string `valid:"required~ตุณไม่ได้ใส่โน๊ต"`
	Date              time.Time
	Order_ID          *uint
}

// POST /baskets
func CraeteBasket(c *gin.Context) {
	var basket entity.Basket
	var game entity.Game
	var payment_status entity.Payment_Status

	if err := c.ShouldBindJSON(&basket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Raw("SELECT * FROM baskets WHERE payment_status_id = 1 AND user_id = ? AND game_id = ?", basket.User_ID, basket.Game_ID).First(&basket); tx.RowsAffected == 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "game in basket"})
		return
	}

	if tx := entity.DB().Where("id = ?", basket.Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "game not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", basket.Payment_Status_ID).First(&payment_status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payment status not found"})
		return
	}

	basValid := BasketValid{
		User_ID:           basket.User_ID,
		Game_ID:           basket.Game_ID,
		Payment_Status_ID: basket.Payment_Status_ID,
		Note:              basket.Note,
		Date:              basket.Date.Local(),
	}

	fmt.Printf("%#v", basValid)

	if _, err := govalidator.ValidateStruct(basValid); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bas := entity.Basket{
		User_ID:           basValid.User_ID,
		Game_ID:           basValid.Game_ID,
		Payment_Status_ID: basValid.Payment_Status_ID,
		Note:              basValid.Note,
		Date:              basValid.Date.Local(),
	}

	if err := entity.DB().Create(&bas).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": basket})
}

// GET /basket/:id
func GetBasket(c *gin.Context) {
	var basket []entity.Basket
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&basket); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "basket not found"})
		return

	}

	c.JSON(http.StatusOK, gin.H{"data": basket})
}

// GET /baskets
func ListBasket(c *gin.Context) {
	var basket []entity.Basket

	if err := entity.DB().Raw("SELECT * FROM payment_statuses").Scan(&basket).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": basket})
}

// GET /userbasket/:uid
func GetUserBasket(c *gin.Context) {
	var basket []entity.Basket
	uid := c.Param("uid")
	if err := entity.DB().Preload("User").Preload("Game").Preload("Payment_Status").Raw("SELECT * FROM baskets WHERE payment_status_id = 1 OR payment_status_id = 2 AND user_id = ?", uid).Find(&basket).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": basket})
}

// GET /userbasketfororder/:uid
func GetUserBasketForOrder(c *gin.Context) {
	var basket []entity.Basket
	uid := c.Param("uid")
	if err := entity.DB().Preload("User").Preload("Game").Preload("Payment_Status").Raw("SELECT * FROM baskets WHERE payment_status_id = 1 AND user_id = ?", uid).Find(&basket).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": basket})
}

// PATCH /baskets
func UpdateBasket(c *gin.Context) {
	var basket entity.Basket

	if err := c.ShouldBindJSON(&basket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updateBasket := entity.Basket{
		Note: basket.Note,
	}

	if err := entity.DB().Where("id = ?", basket.ID).Updates(&updateBasket).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": basket})

}

// DELETE /basket/:id
func DeleteBasket(c *gin.Context) {
	var basket entity.Basket

	if err := c.ShouldBindJSON(&basket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Exec("DELETE FROM baskets WHERE id = ?", basket.ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "basket not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": basket})

}
