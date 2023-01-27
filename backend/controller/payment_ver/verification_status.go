package controller

import (
	"github.com/sut65/team13/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// GET /Verification_Status

func ListVerification_Status(c *gin.Context) {

	var v_status []entity.Verification_Status

	if err := entity.DB().Raw("SELECT * FROM verification_status").Scan(&v_status).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": v_status})

}
