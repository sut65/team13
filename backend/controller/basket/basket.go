package controller

import (
	"github.com/asaskevich/govalidator"
	"github.com/sut65/team13/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /baskets
func CraeteBasket(c *gin.Context) {

	var basket entity.Basket
	var game entity.Game
	var payment_status entity.Payment_Status

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 7 จะถูก bind เข้าตัวแปร basket
	if err := c.ShouldBindJSON(&basket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Raw("SELECT * FROM baskets WHERE payment_status_id = 1 AND user_id = ? AND game_id = ?", basket.User_ID, basket.Game_ID).First(&basket); tx.RowsAffected == 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "game in basket"})
		return
	}

	// 9.ค้นหา game ด้วย id
	if tx := entity.DB().Where("id = ?", basket.Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "game not found"})
		return
	}

	// 10.ค้นหา payment_status ด้วย id
	if tx := entity.DB().Where("id = ?", basket.Payment_Status_ID).First(&payment_status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payment status not found"})
		return
	}

	// 11: สร้าง Basket
	bas := entity.Basket{
		User_ID:           basket.User_ID,
		Game_ID:           basket.Game_ID,
		Payment_Status_ID: basket.Payment_Status_ID,
		Note:              basket.Note,
		Date:              basket.Date.Local(),
	}

	// ขั้นตอนการ validate ที่นำมาจาก unit test
	if _, err := govalidator.ValidateStruct(bas); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 12: บันทึก
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
		//c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		//return
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
		//c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		//return
	}

	if tx := entity.DB().Exec("DELETE FROM baskets WHERE id = ?", basket.ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "basket not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": basket})

}
