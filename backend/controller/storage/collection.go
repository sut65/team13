package controller

import (
	"github.com/asaskevich/govalidator"
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
		Name: collection.Name,
		Note: collection.Note,
		Date: collection.Date,
	}
	if _, err := govalidator.ValidateStruct(bk); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
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

	if err := entity.DB().Preload("User").Raw("SELECT * FROM collections WHERE User_ID = ? ", id).Scan(&collections).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": collections})

}

// DELETE /users/:id

func DeleteCollection(c *gin.Context) {
	var collection entity.Collection
	var zeroCollection entity.Collection

	if err := c.ShouldBindJSON(&collection); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	println(1)
	if tx := entity.DB().Exec("DELETE FROM collections WHERE id = ?", collection.ID); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})

		return

	}
	println(2)
	stor := entity.Storage{
		Collection_ID: &zeroCollection.ID,
	}
	if tx := entity.DB().Where("collection_id = ?", collection.ID).Updates(&stor); tx.RowsAffected == 0 {

		// c.JSON(http.StatusBadRequest, gin.H{"error": "collection not found"})

		//return

	}
	println(3)
	c.JSON(http.StatusOK, gin.H{"data": collection})

}

// PATCH /users

func UpdateCollection(c *gin.Context) {

	var collection entity.Collection

	if err := c.ShouldBindJSON(&collection); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	collect := entity.Collection{
		Name: collection.Name,
		Note: collection.Note,
	}
	if tx := entity.DB().Where("id = ?", collection.ID).Updates(&collect); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "collection not found"})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": collect})

}
