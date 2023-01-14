package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /banners
func CreateBanner(c *gin.Context) {
	var banner entity.Banner

	if err := c.ShouldBindJSON(&banner); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&banner).Error; err != nil {
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

	if err := entity.DB().Preload("Game").Raw("SELECT * FROM banners").Find(&banners).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": banners})

}

// DELETE /users/:id
func DeleteBanner(c *gin.Context) {
	id := c.Param("id")

	if tx := entity.DB().Exec("DELETE FROM storages WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /users

func UpdateBanner(c *gin.Context) {
	var banner entity.Banner

	if err := c.ShouldBindJSON(&banner); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", banner.ID).First(&banner); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "banner not found"})
		return
	}

	if err := entity.DB().Where("id = ?", banner.ID).Updates(&banner).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": banner})
}
