package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)

	"github.com/gin-gonic/gin"

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

	if tx := entity.DB().Where("id = ?", wishlist.User_ID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "video not found"})
		return
	}
	if tx := entity.DB().Where("id = ?", wishlist.Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "video not found"})
		return
	}
	if tx := entity.DB().Where("id = ?", wishlist.Level_ID).First(&wish_Level); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "video not found"})
		return
	}

	bk := entity.Wishlist{
		User:       user, // โยงความสัมพันธ์กับ Entity User
		Game:       game,
		Wish_Level: wish_Level,
		Note:       wishlist.Note,
		Date:       wishlist.Date,
	}

	// 13: บันทึก
	if err := entity.DB().Create(&bk).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": bk})

}

// GET /Wilslist/:id

func GetWishlist(c *gin.Context) {

	var wishlist entity.Wishlist

	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM wishlists WHERE id = ?", id).Scan(&wishlist).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": wishlist})

}

// GET /Wishlist/:id

func ListWishlists(c *gin.Context) {

	var wishlists []entity.Wishlist
	id := c.Param("id")

	if err := entity.DB().Preload("User").Preload("Game").Preload("Wish_level").Raw("SELECT * FROM wishlists WHERE User_ID = ? ", id).Scan(&wishlists).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": wishlists})

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