package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /banners
func CreateBanner(c *gin.Context) {
	var banner entity.Banner
	var user entity.User
	var admin entity.Admin
	var game entity.Game

	if err := c.ShouldBindJSON(&banner); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", banner.User_ID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือก Owner"})
		return
	}

	if tx := entity.DB().Where("id = ?", banner.Admin_ID).First(&admin); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือก Editor"})
		return
	}

	if tx := entity.DB().Where("id = ?", banner.Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือก Game"})
		return
	}

	//loc, _ := time.LoadLocation("Asia/Bangkok")

	newBanner := entity.Banner{
		Banner_Picture: banner.Banner_Picture,
		Description:    banner.Description,
		Edit_at:        banner.Edit_at.Local(),
		User:           user,
		Admin:          admin,
		Game:           game,
	}

	if err := entity.DB().Create(&newBanner).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": banner})
}

// GET /banner/:id
func GetBanner(c *gin.Context) {
	var banner entity.Banner
	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM banners WHERE id = ?", id).Scan(&banner).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": banner})
}

// GET /banners
func ListBanners(c *gin.Context) {
	var banners []entity.Banner

	if err := entity.DB().Preload("Game").Preload("User").Preload("Admin").Raw("SELECT * FROM banners").Find(&banners).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": banners})

}

// DELETE /banner/:id
func DeleteBanner(c *gin.Context) {
	id := c.Param("id")

	if tx := entity.DB().Exec("DELETE FROM banners WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "banner not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /banners

func UpdateBanner(c *gin.Context) {
	var banner entity.Banner
	var user entity.User
	var admin entity.Admin
	var game entity.Game

	if err := c.ShouldBindJSON(&banner); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", banner.User_ID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือก Owner"})
		return
	}

	if tx := entity.DB().Where("id = ?", banner.Admin_ID).First(&admin); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือก Editor"})
		return
	}

	if tx := entity.DB().Where("id = ?", banner.Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือก Game"})
		return
	}

	updateBanner := entity.Banner{
		Banner_Picture: banner.Banner_Picture,
		Description:    banner.Description,
		Edit_at:        banner.Edit_at.Local(),
		User:           user,
		Admin:          admin,
		Game:           game,
	}

	if err := entity.DB().Where("id = ?", banner.ID).Updates(&updateBanner).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": banner})
}
