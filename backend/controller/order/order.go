package controller

import (
	"github.com/asaskevich/govalidator"
	"github.com/sut65/team13/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST/order
func CreateOrder(c *gin.Context) {
	var order entity.Order
	var orderLast entity.Order
	var payment_status entity.Payment_Status
	var ver_status entity.Verification_Status
	var user_Friend entity.Friend

	println("Test1")

	id := c.Param("id")

	println("Test2")

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	println("Test3")

	if tx := entity.DB().Where("id = ?", order.Verification_Status_ID).First(&ver_status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "verification status not found"})
		return
	}

	println("Test4")

	if user_Friend.User_Friend_ID != nil {
		if tx := entity.DB().Where("id = ?", user_Friend.User_Friend_ID).First(&user_Friend); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
			return
		}
	}

	println("Test5")

	od := entity.Order{
		User_ID:             order.User_ID,
		Verification_Status: ver_status,
		Slip:                order.Slip,
		Date:                order.Date.Local(),
		Send_gift:           order.Send_gift,
		Friend_ID:           order.Friend_ID,
	}

	// validate order
	if _, err := govalidator.ValidateStruct(od); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&od).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return
	}

	if tx := entity.DB().Where("user_id = ?", id).Last(&orderLast); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "order not found"})
		return
	}

	//เลือกเฉพาะ order ที่ payment status = 2 (pending)
	if tx := entity.DB().Where("id = 2").Last(&payment_status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "payment status not found"})
		return
	}

	if err := entity.DB().Exec("UPDATE baskets SET payment_status_id = 2, order_id = ? WHERE user_id = ? AND payment_status_id = 1", orderLast.ID, order.User_ID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "basket not found"})
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

	if err := entity.DB().Preload("Verification_Status").Raw("SELECT * FROM orders").Find(&order).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": order})
}

// GET /userorder/
func ListUserOrder(c *gin.Context) {
	var order []entity.Order
	uid := c.Param("uid")
	if err := entity.DB().Preload("User").Preload("Basket").Preload("Verification_Status").Raw("SELECT * FROM orders WHERE user_id = ?", uid).Find(&order).Error; err != nil {
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

//PATCH /order

func UpdateOrder(c *gin.Context) {
	var order entity.Order

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updateOrder := entity.Order{
		Slip: order.Slip,
		Date: order.Date.Local(),
	}

	if _, err := govalidator.ValidateStruct(updateOrder); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id =?", order.ID).Updates(&updateOrder).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}
