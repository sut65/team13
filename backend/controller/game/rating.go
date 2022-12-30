package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)

	"github.com/gin-gonic/gin"

	"net/http"
)

// GET /Rating// id

func GetRating(c *gin.Context) {
	var rating entity.Rating
	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM ratings WHERE id = ?", id).Scan(&rating).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": rating})
}

// Get // rating
func ListRating(c *gin.Context) {

	var rating []entity.Rating

	if err := entity.DB().Raw("SELECT * FROM ratings").Scan(&rating).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": rating})

}
