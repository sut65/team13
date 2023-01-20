package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /users

func CreateCollection(c *gin.Context) {

	var collection entity.Collection
	var user entity.User

	if err := c.ShouldBindJSON(&collection); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", collection.User_ID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "video not found"})
		return
	}

	bk := entity.Collection{
		User: user, // โยงความสัมพันธ์กับ Entity Room
		Note: collection.Note,
		Date: collection.Date,
	}

	// 13: บันทึก
	if err := entity.DB().Create(&bk).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": bk})

}

// GET /Storage/:id

func GetCollection(c *gin.Context) {

	var collection entity.Collection

	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM collections WHERE id = ?", id).Scan(&collection).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": collection})

}

// GET /users

func ListCollections(c *gin.Context) {

	var collections []entity.Collection
	id := c.Param("id")

	if err := entity.DB().Preload("User").Raw("SELECT * FROM collections WHERE id = ? ", id).Scan(&collections).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": collections})

}

// DELETE /users/:id

func DeleteCollection(c *gin.Context) {

	id := c.Param("id")

	if tx := entity.DB().Exec("DELETE FROM collections WHERE id = ?", id); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": id})

}

// PATCH /users

func UpdateCollection(c *gin.Context) {

	var collection entity.Collection

	if err := c.ShouldBindJSON(&collection); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	if tx := entity.DB().Where("id = ?", collection.ID).First(&collection); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "collection not found"})

		return

	}

	if err := entity.DB().Save(&collection).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": collection})

}
