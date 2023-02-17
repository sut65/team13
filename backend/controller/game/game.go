package controller

import (
	"github.com/asaskevich/govalidator"
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
	println(seller.ID)

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
	if game_status.Status_Type != "Not Available" && game.Game_file == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "This Status must Upload File"})

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

	if _, err := govalidator.ValidateStruct(wv); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&wv).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": wv})

}

// GET /game/:id for seller

func GetGame(c *gin.Context) {
	var game []entity.Game
	id := c.Param("id")

	if err := entity.DB().Preload("Game_Status").Preload("Seller").Preload("Rating").Preload("Type_Game").Raw("SELECT id,deleted_at,game_name,game_price,game_description,publish_date,seller_id,game_status_id,type_game_id,rating_id,game_picture FROM games WHERE seller_id = ? AND deleted_at IS NULL", id).Find(&game).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": game})
}

// /Individual_Game/:id
func GetIndividualGame(c *gin.Context) {
	var game []entity.Game
	id := c.Param("id")

	if err := entity.DB().Preload("Game_Status").Preload("Seller").Preload("Rating").Preload("Type_Game").Raw("SELECT id,deleted_at,game_name,game_price,game_description,publish_date,seller_id,game_status_id,type_game_id,rating_id,game_picture FROM games WHERE id = ?", id).Find(&game).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": game})
}

// GET /gamefile//
func GetGamefile(c *gin.Context) {
	var game []entity.Game
	id := c.Param("id")

	if err := entity.DB().Raw("SELECT id,game_name , game_file FROM games WHERE deleted_at IS NULL", id).Find(&game).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": game})
}

// GET /game//
func ListGames(c *gin.Context) {
	var game []entity.Game

	if err := entity.DB().Preload("Game_Status").Preload("Seller").Preload("Rating").Preload("Type_Game").Raw("SELECT id,deleted_at,game_name,game_price,game_description,publish_date,seller_id,game_status_id,type_game_id,rating_id,game_picture FROM games WHERE deleted_at IS NULL").Find(&game).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": game})
}

// GET /ALLgame// // ไม่สนใจ deleted_at เอาทุกตัวขึ้นมา
func ListALLGames(c *gin.Context) {
	var game []entity.Game

	if err := entity.DB().Preload("Game_Status").Preload("Seller").Preload("Rating").Preload("Type_Game").Raw("SELECT  id,deleted_at,game_name,game_price,game_description,publish_date,seller_id,game_status_id,type_game_id,rating_id,game_picture FROM games").Find(&game).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": game})
}

// DELETE /game/:id

func DeleteGame(c *gin.Context) {

	id := c.Param("id")

	if tx := entity.DB().Where("id = ?", id).Delete(&entity.Game{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "game not found"})
		return
	}

	if tx := entity.DB().Where("game_id = ?", id).Delete(&entity.Storage{}); tx.RowsAffected == 0 {
		// อนุญาตให้หาไม่เจอได้เพราะตอนลบมันอาจจะยังไม่มีเจ้าของ
		// c.JSON(http.StatusBadRequest, gin.H{"error": "storage not found"})
		// return
	}

	if tx := entity.DB().Exec("DELETE FROM baskets WHERE game_id = ?", id); tx.RowsAffected == 0 {
		// อนุญาตให้หาไม่เจอได้เพราะตอนลบมันอาจจะยังไม่มีเจ้าของ
		// 	c.JSON(http.StatusBadRequest, gin.H{"error": "game not found"})
		// 	return
	}

	// if tx := entity.DB().Exec("DELETE FROM games WHERE id = ?", id); tx.RowsAffected == 0 {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "game not found"})
	// 	return
	// }

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /game

func UpdateGame(c *gin.Context) {
	var game entity.Game
	var rating entity.Rating
	var game_status entity.Game_Status
	var type_game entity.Type_Game

	if err := c.ShouldBindJSON(&game); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
	if game.Game_file == "" {
		entity.DB().Raw("SELECT  game_file FROM games WHERE deleted_at IS NULL", game.ID).Find(&game.Game_file)
	}

	if game_status.Status_Type != "Not Available" && (game.Game_file == "") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "This Status must Upload File"})

		return

	}

	updateGame := entity.Game{
		Game_Name:        game.Game_Name, //valid need value
		Game_Price:       game.Game_Price,
		Game_description: game.Game_description,
		Rating:           rating,
		Game_Status:      game_status,
		Type_Game:        type_game,
		Game_file:        game.Game_file,
		Game_Picture:     game.Game_Picture,
		Publish_Date:     game.Publish_Date, //valid need value
	}

	if _, err := govalidator.ValidateStruct(updateGame); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Where("id = ?", game.ID).Updates(&updateGame).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": game})

}
