package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)

	"github.com/gin-gonic/gin"

	"net/http"
)

// GET /Game_status // id

func GetGame_status(c *gin.Context) {
	var game_status entity.Game_Status
	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM game_statuses WHERE id = ?", id).Scan(&game_status).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": game_status})
}

// Get // Game_status
func ListGame_status(c *gin.Context) {

	var game_status []entity.Game_Status

	if err := entity.DB().Raw("SELECT * FROM game_statuses").Scan(&game_status).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": game_status})

}
