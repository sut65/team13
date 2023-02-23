package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)
	"gorm.io/gorm"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"

	"fmt"
	"net/http"
)

// POST /Wishlist

func CreateWishlist(c *gin.Context) {

	var wishlist entity.Wishlist
	var user entity.User
	var game entity.Game
	var wish_Level entity.Wish_Level

	if err := c.ShouldBindJSON(&wishlist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Raw("SELECT * FROM wishlists WHERE user_id = ? AND game_id = ?", wishlist.User_ID, wishlist.Game_ID).First(&wishlist); tx.RowsAffected == 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "เกมอยู่ใน Wishlist แล้ว"})
		return
	}

	if tx := entity.DB().Where("id = ?", wishlist.User_ID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}
	if tx := entity.DB().Where("id = ?", wishlist.Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Game not found"})
		return
	}
	if tx := entity.DB().Where("id = ?", wishlist.Wish_Level_ID).First(&wish_Level); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "wish_level not found"})
		return
	}

	wish := entity.Wishlist{
		User_ID:       wishlist.User_ID,
		Game_ID:       wishlist.Game_ID,
		Wish_Level_ID: wishlist.Wish_Level_ID,
		Note:          wishlist.Note,
		Date:          wishlist.Date.Local(),
	}

	fmt.Printf("%#v", wish)

	if _, err := govalidator.ValidateStruct(wish); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 13: บันทึก
	if err := entity.DB().Create(&wish).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": wish})

}

// GET /Wilslist/:id

func GetWishlist(c *gin.Context) {

	var wishlist entity.Wishlist

	id := c.Param("id")

	if err := entity.DB().Preload("User").Preload("Game").Preload("Wish_Level").Raw("SELECT * FROM wishlists WHERE User_ID = ?", id).Find(&wishlist).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": wishlist})

}

// GET /Wishlist/:id

func ListWishlists(c *gin.Context) {

	var game entity.Game
	var wishlist []entity.Wishlist
	id := c.Param("id")

	if err := entity.DB().Preload("Game", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "deleted_at", "game_name", "game_price", "game_description", "publish_date", "seller_id", "game_status_id", "type_game_id", "rating_id", "game_picture").Find(&game)
	}).Preload("User").Preload("Wish_Level").Raw("SELECT * FROM wishlists WHERE User_ID = ? ", id).Find(&wishlist).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": wishlist})

}

// DELETE /Wishlists/:id

func DeleteWishlist(c *gin.Context) {
	var wishlist entity.Wishlist
	if err := c.ShouldBindJSON(&wishlist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Exec("DELETE FROM wishlists WHERE id = ?", wishlist.ID); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": wishlist})

}

// PATCH /users

func UpdateWishlist(c *gin.Context) {

	var wishlist entity.Wishlist
	var wish_level entity.Wish_Level

	if err := c.ShouldBindJSON(&wishlist); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	wish := entity.Wishlist{
		Wish_Level: wish_level,
		Note:       wishlist.Note,
	}
	if tx := entity.DB().Where("id = ?", wishlist.ID).Updates(&wish); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "collection not found"})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": wish})

}
