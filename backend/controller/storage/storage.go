package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /users

func CreateStroage(c *gin.Context) {

	var storage entity.Storage
	var user entity.User
	var game entity.Game

	if err := c.ShouldBindJSON(&storage); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", storage.User_ID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "video not found"})
		return
	}
	if tx := entity.DB().Where("id = ?", storage.Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "video not found"})
		return
	}

	bk := entity.Storage{
		User: user, // โยงความสัมพันธ์กับ Entity Room
		Game: game,
	}

	// 13: บันทึก
	if err := entity.DB().Create(&bk).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": bk})

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

// List //Storages by user
func ListStoragesUser(c *gin.Context) {

	var storages []entity.Storage
	id := c.Param("id")

	// มี prelaod เพื่อใช้โหลดให้ระบบ Storages
	if err := entity.DB().Preload("Game").Preload("User").Preload("Collection").Raw("SELECT * FROM storages WHERE user_id = ?", id).Find(&storages).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": storages})

}

// DELETE /users/:id

func DeleteStorage(c *gin.Context) {
	var storage entity.Storage
	if err := c.ShouldBindJSON(&storage); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Exec("DELETE FROM storages WHERE id = ?", storage.ID); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": storage})

}

// PATCH /users

func UpdateStorage(c *gin.Context) {

	var storage entity.Storage
	// var collect entity.Collection
	if err := c.ShouldBindJSON(&storage); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	stor := entity.Storage{
		Collection_ID: storage.Collection_ID,
	}

	if tx := entity.DB().Where("id = ?", storage.ID).First(&storage).Updates(&stor); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "storage not found"})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": stor})

}
