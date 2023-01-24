package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)
	"golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /admins

func CreateAdmin(c *gin.Context) {
	var admin entity.Admin
	var gender entity.Gender
	var department entity.Department
	var province entity.Province
	var emailCheck entity.Admin

	if err := c.ShouldBindJSON(&admin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", admin.Gender_ID).First(&gender); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please select your gender"})
		return
	}
	if tx := entity.DB().Where("id = ?", admin.Department_ID).First(&department); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "not found"})
		return
	}
	if tx := entity.DB().Where("id = ?", admin.Province_ID).First(&province); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "not found"})
		return
	}

	if tx := entity.DB().Where("email = ?", admin.Email).First(&emailCheck); !(tx.RowsAffected == 0) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "This email is used"})
		return
	}

	hashPassword, err := bcrypt.GenerateFromPassword([]byte(admin.Password), 12)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error hashing password"})
		return
	}

	newAdmin := entity.Admin{
		Name:       admin.Name,
		Email:      admin.Email,
		Password:   string(hashPassword),
		Gender:     gender,
		Department: admin.Department,
		Province:   admin.Province,
	}

	if err := entity.DB().Create(&newAdmin).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": admin})

}

// GET /user/:email --> ใช้อยู่

func GetAdmin(c *gin.Context) {
	var admin entity.Admin
	email := c.Param("email")

	if err := entity.DB().Preload("Department").Preload("Province").Preload("Gender").Raw("SELECT * FROM admins WHERE email = ?", email).Find(&admin).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": admin})
}

// GET /users

func ListAdmin(c *gin.Context) {
	var admin []entity.Admin

	if err := entity.DB().Preload("Department").Preload("Province").Preload("Gender").Raw("SELECT * FROM admins").Scan(&admin).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": admin})
}

// // GET /sellers
// func ListSellers(c *gin.Context) {
// 	var users []entity.User

// 	if err := entity.DB().Preload("Game").Preload("Storage").Raw("SELECT * FROM users WHERE Is_Seller = ?", true).Scan(&users).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"data": users})
// }

// DELETE /users/:email --> ใช้อยู่

func DeleteAdmin(c *gin.Context) {
	email := c.Param("email")
	if tx := entity.DB().Exec("DELETE FROM admins WHERE email = ?", email); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "admin not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": email})
}

// PATCH /users --> ใช้อยู่

func UpdateAdmin(c *gin.Context) {
	var user entity.User
	var gender entity.Gender
	var storage entity.Storage
	var game entity.Game

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(user.Password) <= 7 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสผ่านต้องมากกว่าหรือเท่ากับ 8 ตัว"})
		return
	}

	if !(user.Password[0:7] == "$2a$12$") { // เช็คว่ารหัสที่ผ่านเข้ามามีการ encrypt แล้วหรือยัง หากมีการ encrypt แล้วจะไม่ทำการ encrypt ซ้ำ
		hashPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "error hashing password"})
			return
		}
		print("HASH!!!!")
		user.Password = string(hashPassword)
	} else {
		print("NOT HASH!!!")
	}

	if tx := entity.DB().Where("id = ?", user.Gender_ID).First(&gender); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "gender not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", user.Favorite_Game_ID).First(&storage); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "storage not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", user.Out_Standing_Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "game not found"})
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

// Get /user_storage/:email --> ใช้อยู่
// func ListUserStorages(c *gin.Context) {
// 	var storages []entity.Storage
// 	var user entity.User
// 	email := c.Param("email")

// 	// get user ที่ตรงกับ email ออกมาก่อนเพื่อเอา ID มาใช้ get storage ของ user คนนั้นๆอีกที
// 	if err := entity.DB().Raw("SELECT * FROM users WHERE email = ?", email).Scan(&user).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// list เฉพาะ storage ของ user คนนั้นๆ | ต้องใช้ .Find สำหรับ .Preload
// 	if err := entity.DB().Preload("Game").Raw("SELECT * FROM storages WHERE user_id = ?", user.ID).Find(&storages).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": storages})

// }

// // Get /user_game/:email (Seller) --> ใช้อยู่
// func ListUserGames(c *gin.Context) {
// 	var games []entity.Game
// 	var user entity.User
// 	email := c.Param("email")

// 	// get user ที่ตรงกับ email ออกมาก่อนเพื่อเอา ID มาใช้ get game ของ user คนนั้นๆอีกที
// 	if err := entity.DB().Raw("SELECT * FROM users WHERE email = ?", email).Scan(&user).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// list เฉพาะ game ของ user คนนั้นๆ
// 	if err := entity.DB().Raw("SELECT * FROM games WHERE seller_id = ?", user.ID).Scan(&games).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": games})

// }

// // Get /useraddfriend/:uid  --> ใช้อยู่
// func GetUserForAddFriend(c *gin.Context) {
// 	var user []entity.User
// 	uid := c.Param("uid")
// 	if err := entity.DB().Raw("SELECT * FROM users WHERE id != ?", uid).Find(&user).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": user})
// }
