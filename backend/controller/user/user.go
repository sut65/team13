package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /users

func CreateUser(c *gin.Context) {
	var user entity.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})

}

// GET /user/:email --> ใช้อยู่

func GetUser(c *gin.Context) {
	var user entity.User
	email := c.Param("email")

	if err := entity.DB().Raw("SELECT * FROM users WHERE email = ?", email).Scan(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}

// GET /users

func ListUsers(c *gin.Context) {
	var users []entity.User

	if err := entity.DB().Preload("Game").Preload("Storage").Raw("SELECT * FROM users").Scan(&users).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": users})
}

// DELETE /users/:id

func DeleteUser(c *gin.Context) {

	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM users WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /users --> ใช้อยู่

func UpdateUser(c *gin.Context) {
	var user entity.User
	var gender entity.Gender
	var storage entity.Storage
	var game entity.Game

	if err := c.ShouldBindJSON(&user); err != nil {
		//c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		//return
	}

	if tx := entity.DB().Where("id = ?", user.Gender_ID).First(&gender); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", user.Favorite_Game_ID).First(&storage); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", user.Out_Standing_Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	updateUser := entity.User{
		Password:             user.Password,
		Profile_Name:         user.Profile_Name,
		Profile_Description:  user.Profile_Description,
		Profile_Picture:      user.Profile_Picture,
		Gender:               gender,
		Favorite_Game_ID:     &storage.ID,
		Is_Seller:            user.Is_Seller,
		Store_Description:    user.Store_Description,
		Out_Standing_Game_ID: &game.ID,
		Store_Contact:        user.Store_Contact,
	}

	if err := entity.DB().Where("email = ?", user.Email).Updates(&updateUser).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})

}

// Get /user_storage/:email
func ListUserStorages(c *gin.Context) {
	var storages []entity.Storage
	var user entity.User
	email := c.Param("email")

	// get user ที่ตรงกับ email ออกมาก่อนเพื่อเอา ID มาใช้ get storage ของ user คนนั้นๆอีกที
	if err := entity.DB().Raw("SELECT * FROM users WHERE email = ?", email).Scan(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// list เฉพาะ storage ของ user คนนั้นๆ | ต้องใช้ .Find สำหรับ .Preload
	if err := entity.DB().Preload("Game").Raw("SELECT * FROM storages WHERE user_id = ?", user.ID).Find(&storages).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": storages})

}

// Get /user_game/:email (Seller)
func ListUserGames(c *gin.Context) {
	var games []entity.Game
	var user entity.User
	email := c.Param("email")

	// get user ที่ตรงกับ email ออกมาก่อนเพื่อเอา ID มาใช้ get game ของ user คนนั้นๆอีกที
	if err := entity.DB().Raw("SELECT * FROM users WHERE email = ?", email).Scan(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// list เฉพาะ game ของ user คนนั้นๆ
	if err := entity.DB().Raw("SELECT * FROM games WHERE seller_id = ?", user.ID).Scan(&games).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": games})

}
