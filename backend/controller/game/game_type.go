package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)

	"github.com/gin-gonic/gin"

	"net/http"
)

// GET /Rating// id

func GetGame_type(c *gin.Context) {
	var game_type entity.Type_Game
	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM type_games WHERE id = ?", id).Scan(&game_type).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": game_type})
}

// Get // rating
func ListGame_type(c *gin.Context) {

	var game_type []entity.Type_Game

	if err := entity.DB().Raw("SELECT * FROM type_games").Scan(&game_type).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": game_type})

}
