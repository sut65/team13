package controller

import (
	"github.com/asaskevich/govalidator"
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
	// var emailCheck entity.Admin

	if err := c.ShouldBindJSON(&admin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", admin.Gender_ID).First(&gender); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please select your gender"})
		return
	}
	if tx := entity.DB().Where("id = ?", admin.Department_ID).First(&department); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Department not found"})
		return
	}
	if tx := entity.DB().Where("id = ?", admin.Province_ID).First(&province); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Province not found"})
		return
	}

	// if tx := entity.DB().Where("email = ?", admin.Email).First(&emailCheck); !(tx.RowsAffected == 0) {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "This email is used"})
	// 	return
	// }

	hashPassword, err := bcrypt.GenerateFromPassword([]byte(admin.Password), 12)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error hashing password"})
		return
	}

	newAdmin := entity.Admin{
		Name:            admin.Name,
		Email:           admin.Email,
		Address:         admin.Address,
		Profile_Picture: admin.Profile_Picture,
		Password:        string(hashPassword),
		Gender:          gender,
		Department:      department,
		Province:        province,
	}
	if _, err := govalidator.ValidateStruct(newAdmin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
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

	if err := entity.DB().Preload("Department").Preload("Province").Preload("Gender").Raw("SELECT * FROM admins").Find(&admin).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": admin})
}

func DeleteAdmin(c *gin.Context) {

	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM admins WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "admin not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /users --> ใช้อยู่

func UpdateAdmin(c *gin.Context) {
	var admin entity.Admin
	var gender entity.Gender
	var department entity.Department
	var province entity.Province

	if err := c.ShouldBindJSON(&admin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// if len(admin.Password) <= 7 {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสผ่านต้องมากกว่าหรือเท่ากับ 8 ตัว"})
	// 	return
	// }

	if tx := entity.DB().Where("id = ?", admin.Gender_ID).First(&gender); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "gender not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", admin.Department_ID).First(&department); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "department not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", admin.Province_ID).First(&province); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "province not found"})
		return
	}

	updateAdmin := entity.Admin{
		Name:            admin.Name,
		Email:           admin.Email,
		Password:        admin.Password,
		Address:         admin.Address,
		Profile_Picture: admin.Profile_Picture,
		Gender:          gender,
		Department:      department,
		Province:        province,

		// Game_Name:        game.Game_Name,
		// Game_Price:       game.Game_Price,
		// Game_description: game.Game_description,
		// Rating:           rating,
		// Game_Status:      game_status,
		// Type_Game:        type_game,
		// Game_file:        game.Game_file,
		// Game_Picture:     game.Game_Picture,
	}
	if _, err := govalidator.ValidateStruct(updateAdmin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if !(admin.Password[0:7] == "$2a$12$") { // เช็คว่ารหัสที่ผ่านเข้ามามีการ encrypt แล้วหรือยัง หากมีการ encrypt แล้วจะไม่ทำการ encrypt ซ้ำ
		hashPassword, err := bcrypt.GenerateFromPassword([]byte(admin.Password), 12)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "error hashing password"})
			return
		}
		print("HASH!!!!")
		admin.Password = string(hashPassword)
	} else {
		print("NOT HASH!!!")
	}
	if err := entity.DB().Where("ID = ?", admin.ID).Updates(&updateAdmin).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": admin})

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
