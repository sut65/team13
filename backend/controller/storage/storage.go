package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /users

func CreateStroage(c *gin.Context) {

	var storage entity.Storage

	if err := c.ShouldBindJSON(&storage); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	if err := entity.DB().Create(&storage).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": storage})

}

// GET /storage/:id

func GetStorage(c *gin.Context) {

	var storage entity.Storage

	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM storages WHERE id = ?", id).Scan(&storage).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": storage})

}

// GET /storages

func ListStorages(c *gin.Context) {

	var storages []entity.Storage

	// มี prelaod เพื่อใช้โหลดให้ระบบ user
	if err := entity.DB().Preload("Game").Raw("SELECT * FROM storages").Find(&storages).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": storages})

}

// DELETE /users/:id

func DeleteStorage(c *gin.Context) {

	id := c.Param("id")

	if tx := entity.DB().Exec("DELETE FROM storages WHERE id = ?", id); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": id})

}

// PATCH /users

func UpdateStorage(c *gin.Context) {

	var storage entity.Storage

	if err := c.ShouldBindJSON(&storage); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	if tx := entity.DB().Where("id = ?", storage.ID).First(&storage); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "storage not found"})

		return

	}

	if err := entity.DB().Save(&storage).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": storage})

}
