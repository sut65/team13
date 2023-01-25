package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)

	"github.com/gin-gonic/gin"

	"net/http"
)

// GET /Wishlist/:id

func ListWish_Level(c *gin.Context) {

	var wish_level []entity.Wish_Level

	if err := entity.DB().Raw("SELECT * FROM wish_levels").Scan(&wish_level).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": wish_level})

}
