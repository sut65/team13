package controller

import (
	"github.com/asaskevich/govalidator"
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)
	"golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"

	"net/http"
)

// type UserValid struct {
// 	// Normal User
// 	gorm.Model
// 	Email               string `gorm:"uniqueIndex" valid:"email~รูปแบบ email ไม่ถูกต้อง,required~กรุณากรอก email"`
// 	Password            string `valid:"minstringlength(8)~ความยาวรหัสผ่านต้องไม่ต่ำกว่า 8 ตัวอักษร,required~กรุณากรอกรหัสผ่าน"`
// 	Profile_Name        string `valid:"maxstringlength(50)~ชื่อความยาวไม่เกิน 50 ตัวอักษร,required~กรุณากรอกชื่อ"`
// 	Profile_Description string `valid:"maxstringlength(200)~Profile Description ความยาวไม่เกิน 200 ตัวอักษร"`
// 	Profile_Picture     string `valid:"matches((data:image(.+);base64.+))~รูปภาพไม่ถูกต้อง"` // ยังใช้ไม่ได้
// 	Gender_ID           *uint
// 	Favorite_Game_ID    *uint
// 	// Game Store User
// 	Is_Seller            bool
// 	Store_Description    string `valid:"maxstringlength(200)~Store Description ความยาวไม่เกิน 200 ตัวอักษร"`
// 	Out_Standing_Game_ID *uint
// 	Store_Contact        string `valid:"maxstringlength(100)~Store Contact ความยาวไม่เกิน 100 ตัวอักษร"`
// }

// POST /users --> ใช้อยู่

func CreateUser(c *gin.Context) {
	var user entity.User
	var emailCheck entity.User
	var gender entity.Gender

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", user.Gender_ID).First(&gender); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือกเพศ"})
		return
	}

	if tx := entity.DB().Where("email = ?", user.Email).First(&emailCheck); !(tx.RowsAffected == 0) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "อีเมลนี้ถูกใช้ไปแล้ว"})
		return
	}

	// newUserValid := UserValid{
	// 	Email:               user.Email,
	// 	Password:            user.Password,
	// 	Profile_Name:        user.Profile_Name,
	// 	Profile_Description: user.Profile_Description,
	// 	Profile_Picture:     user.Profile_Picture,
	// }

	// create new object for create new record
	newUser := entity.User{
		Email:               user.Email,
		Password:            user.Password,
		Profile_Name:        user.Profile_Name,
		Profile_Description: user.Profile_Description,
		Profile_Picture:     user.Profile_Picture,
		Gender:              gender,
	}

	// validate user
	if _, err := govalidator.ValidateStruct(newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// hashing after validate
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), 12)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error hashing password"})
		return
	}

	newUser.Password = string(hashPassword)

	if err := entity.DB().Create(&newUser).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})

}

// GET /user/:email --> ใช้อยู่

func GetUser(c *gin.Context) {
	var user entity.User
	email := c.Param("email")

	if err := entity.DB().Preload("Game").Preload("Storage").Preload("Gender").Raw("SELECT * FROM users WHERE email = ?", email).Find(&user).Error; err != nil {
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

// GET /sellers
func ListSellers(c *gin.Context) {
	var users []entity.User

	if err := entity.DB().Preload("Game").Preload("Storage").Raw("SELECT * FROM users WHERE Is_Seller = ?", true).Scan(&users).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": users})
}

// DELETE /users/:email --> ใช้อยู่

func DeleteUser(c *gin.Context) {
	email := c.Param("email")
	if tx := entity.DB().Exec("DELETE FROM users WHERE email = ?", email); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": email})
}

// PATCH /users --> ใช้อยู่

func UpdateUser(c *gin.Context) {
	var user entity.User
	var gender entity.Gender
	var storage entity.Storage
	var game entity.Game

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", user.Gender_ID).First(&gender); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "gender not found"})
		return
	}

	if *user.Favorite_Game_ID != 0 {
		if tx := entity.DB().Where("id = ?", user.Favorite_Game_ID).First(&storage); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "storage not found"})
			return
		}
	}

	if *user.Out_Standing_Game_ID != 0 {
		if tx := entity.DB().Where("id = ?", user.Out_Standing_Game_ID).First(&game); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "game not found"})
			return
		}
	}

	// updateUserValid := UserValid{
	// 	Email:               user.Email,
	// 	Password:            user.Password,
	// 	Profile_Name:        user.Profile_Name,
	// 	Profile_Description: user.Profile_Description,
	// 	Profile_Picture:     user.Profile_Picture,
	// 	Is_Seller:           user.Is_Seller,
	// 	Store_Description:   user.Store_Description,
	// 	Store_Contact:       user.Store_Contact,
	// }

	updateUser := entity.User{
		Email:                user.Email,
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

	// validate user
	if _, err := govalidator.ValidateStruct(updateUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if !(user.Password[0:7] == "$2a$12$") { // เช็คว่ารหัสที่ผ่านเข้ามามีการ encrypt แล้วหรือยัง หากมีการ encrypt แล้วจะไม่ทำการ encrypt ซ้ำ
		hashPassword, err := bcrypt.GenerateFromPassword([]byte(updateUser.Password), 12)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "error hashing password"})
			return
		}
		print("HASH!!!!")
		updateUser.Password = string(hashPassword)
	} else {
		print("NOT HASH!!!")
	}

	if err := entity.DB().Where("email = ?", user.Email).Updates(&updateUser).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})

}

// Get /user_storage/:email --> ใช้อยู่
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
	if err := entity.DB().Preload("Game").Raw("SELECT * FROM storages WHERE user_id = ? AND deleted_at IS NULL", user.ID).First(&storages).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": storages})

}

// Get /user_game/:email (Seller) --> ใช้อยู่
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
	if err := entity.DB().Raw("SELECT * FROM games WHERE seller_id = ? AND deleted_at IS NULL", user.ID).Scan(&games).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": games})

}

// Get /useraddfriend/:uid  --> ใช้อยู่
func GetUserForAddFriend(c *gin.Context) {
	var user []entity.User
	uid := c.Param("uid")
	if err := entity.DB().Raw("SELECT * FROM users WHERE id != ?", uid).Find(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}
