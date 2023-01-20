package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /games

func CreateGame(c *gin.Context) {
	var game entity.Game
	var rating entity.Rating
	var game_status entity.Game_Status
	var type_game entity.Type_Game
	var seller entity.User

	if err := c.ShouldBindJSON(&game); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	if tx := entity.DB().Where("id = ?", game.Seller_ID).First(&seller); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Seller not found"})
		return

	}

	if tx := entity.DB().Where("id = ?", game.Rating_ID).First(&rating); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Rating not found"})
		return

	}
	if tx := entity.DB().Where("id = ?", game.Game_Status_ID).First(&game_status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Game Status not found"})
		return

	}
	if tx := entity.DB().Where("id = ?", game.Type_Game_ID).First(&type_game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Type Game not found"})

		return

	}
	wv := entity.Game{

		Game_Name:        game.Game_Name,
		Game_Price:       game.Game_Price,
		Game_description: game.Game_description,
		Publish_Date:     game.Publish_Date,
		Seller:           seller,
		Rating:           rating,
		Game_Status:      game_status,
		Type_Game:        type_game,
		Game_file:        game.Game_file,
		Game_Picture:     game.Game_Picture,
	}
	if err := entity.DB().Create(&wv).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": wv})

}

// GET /game/:id

func GetGame(c *gin.Context) {
	var game entity.Game
	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM games WHERE id = ?", id).Scan(&game).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": game})
}

// GET /game//
func ListGames(c *gin.Context) {
	var game []entity.Game

	if err := entity.DB().Preload("Game_Status").Preload("Seller").Preload("Rating").Preload("Type_Game").Raw("SELECT * FROM games").Find(&game).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": game})
}

// DELETE /game/:id

func DeleteGame(c *gin.Context) {

	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM games WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "game not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /game

func UpdateGame(c *gin.Context) {
	var game entity.Game
	var rating entity.Rating
	var game_status entity.Game_Status
	var type_game entity.Type_Game
	var seller entity.User
	if err := c.ShouldBindJSON(&game); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", game.Seller_ID).First(&seller); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Seller not found"})
		return

	}

	if tx := entity.DB().Where("id = ?", game.Rating_ID).First(&rating); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Rating not found"})
		return

	}
	if tx := entity.DB().Where("id = ?", game.Game_Status_ID).First(&game_status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Game Status not found"})
		return

	}
	if tx := entity.DB().Where("id = ?", game.Type_Game_ID).First(&type_game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Type Game not found"})

		return

	}

	updateGame := entity.Game{
		Game_Name:        game.Game_Name,
		Game_Price:       game.Game_Price,
		Game_description: game.Game_description,
		Rating:           rating,
		Game_Status:      game_status,
		Type_Game:        type_game,
	}

	if err := entity.DB().Where("id = ?", game.ID).Updates(&updateGame).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": game})

}
