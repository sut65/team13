package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/sut65/team13/entity"

	"net/http"
)

// POST /payment_ver

func CreatePaymentVer(c *gin.Context) {
	var payment_ver entity.Payment_Verification
	var admin entity.Admin
	var ver_status entity.Verification_Status
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

	if tx := entity.DB().Where("id = ?", payment_ver.VS_ID).First(&ver_status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือกสถานะ"})
		return
	}

	paymentver := entity.Payment_Verification{
		Order: order,
		VS:    ver_status,
		Note:  payment_ver.Note,
		Admin: admin,
		Date:  payment_ver.Date.Local(),
	}

	if err := entity.DB().Create(&paymentver).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": payment_ver})
}

// GET /payment_ver/:id
func GetPaymentVer(c *gin.Context) {
	var payment_ver entity.Payment_Verification
	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM payment_ver WHERE id = ?", id).Scan(&payment_ver).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": payment_ver})
}

// GET /payment_ver
func ListPaymentVer(c *gin.Context) {
	var payment_verification []entity.Payment_Verification

	if err := entity.DB().Preload("Order_ID").Preload("VS_ID").Preload("Admin_ID").Raw("SELECT * FROM payment_verification").Scan(&payment_verification).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": payment_verification})
}

// PATCH /payments_ver
func UpdatePaymentVer(c *gin.Context) {
	var payment_ver entity.Payment_Verification
	var ver_status entity.Verification_Status

	if err := c.ShouldBindJSON(&payment_ver); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatepaymentver := entity.Payment_Verification{
		VS:   ver_status,
		Note: payment_ver.Note,
		Date: payment_ver.Date.Local(),
	}

	if tx := entity.DB().Where("id = ?", payment_ver.ID).Updates(&updatepaymentver); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "collection not found"})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": updatepaymentver})
}
