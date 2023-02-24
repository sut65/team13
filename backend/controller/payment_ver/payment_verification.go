package controller

import (
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/sut65/team13/entity"

	"net/http"
)

// POST /payment_ver
func CreatePaymentVer(c *gin.Context) {

	var payment_ver entity.Payment_Verification
	var admin entity.Admin
	var ver_status entity.Verification_Status
	var ver_status_if entity.Verification_Status
	var order entity.Order

	if err := c.ShouldBindJSON(&payment_ver); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", payment_ver.Admin_ID).First(&admin); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Admin user not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", payment_ver.Order_ID).First(&order); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือกรายการสั่งซื้อ"})
		return
	}

	if tx := entity.DB().Where("id = ?", payment_ver.Verification_Status_ID).First(&ver_status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือกรายการสั่งซื้อ"})
		return
	}

	paymentver := entity.Payment_Verification{
		Order:               order,
		Verification_Status: ver_status,
		Note:                payment_ver.Note,
		Admin:               admin,
		Date:                payment_ver.Date.Local(),
	}

	//validate payment ver
	if _, err := govalidator.ValidateStruct(paymentver); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&paymentver).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// //update verification status จาก = 1(รอการตรวจสอบ)
	if err := entity.DB().Exec("UPDATE orders SET verification_status_id = ? WHERE id = ? AND verification_status_id = 1", payment_ver.Verification_Status_ID, order.ID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "order not found"})
		return
	}

	// Update Basket
	if tx := entity.DB().Where("id = 2").Last(&ver_status_if); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "verifications tatus not found"})
		return
	}

	if *payment_ver.Verification_Status_ID == ver_status_if.ID {
		if err := entity.DB().Exec("UPDATE baskets SET payment_status_id = 3 WHERE order_id = ?", payment_ver.Order_ID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "basket not found"})
			return
		}

	}
	c.JSON(http.StatusOK, gin.H{"data": payment_ver})

}

// GET /payment_ver/:id
func GetPaymentVer(c *gin.Context) {
	var payment_ver entity.Payment_Verification
	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM payment_verifications WHERE id = ?", id).Scan(&payment_ver).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": payment_ver})
}

// GET /payment_ver
func ListPaymentVer(c *gin.Context) {
	var payment_verification []entity.Payment_Verification

	if err := entity.DB().Preload("Order").Preload("Verification_Status").Preload("Admin").Raw("SELECT * FROM payment_verifications").Find(&payment_verification).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": payment_verification})
}

// // PATCH /payments_ver
func UpdatePaymentVer(c *gin.Context) {
	var payment_ver entity.Payment_Verification
	var ver_status entity.Verification_Status
	// var order entity.Order

	println("Test1")

	if err := c.ShouldBindJSON(&payment_ver); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	println("Test2")

	if tx := entity.DB().Where("id = ?", payment_ver.Verification_Status_ID).First(&ver_status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือกสถานะ"})
		return
	}

	println("Test3")

	updatePaymentVer := entity.Payment_Verification{
		Verification_Status_ID: payment_ver.Verification_Status_ID,
		Note:                   payment_ver.Note,
		Date:                   payment_ver.Date.Local(),
	}

	println("Test4")
	println(payment_ver.ID)

	//validate updatPaymentVer
	if _, err := govalidator.ValidateStruct(updatePaymentVer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", payment_ver.ID).Updates(&updatePaymentVer); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "payment verification not found"})

		return

	}

	//Update Basket
	var ver_status_if entity.Verification_Status
	var paymentForUpdateBasket entity.Payment_Verification

	if tx := entity.DB().Where("id = ?", payment_ver.ID).First(&paymentForUpdateBasket); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "order not found"})
		return
	}

	if tx := entity.DB().Where("id = 2").Last(&ver_status_if); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "verifications tatus not found"})
		return
	}

	if *updatePaymentVer.Verification_Status_ID == ver_status_if.ID {
		if err := entity.DB().Exec("UPDATE baskets SET payment_status_id = 3 WHERE order_id = ?", paymentForUpdateBasket.Order_ID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "basket not found"})
			return
		}
	}

	println("Test5")

	c.JSON(http.StatusOK, gin.H{"data": payment_ver})
}
