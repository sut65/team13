package controller

import (
	"github.com/asaskevich/govalidator"
	"github.com/sut65/team13/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /friends
func CraeteFriend(c *gin.Context) {

	var friend entity.Friend
	var user entity.User
	var intimate entity.Intimate
	var game entity.Game

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 7 จะถูก bind เข้าตัวแปร friend
	if err := c.ShouldBindJSON(&friend); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9.ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", friend.User_Friend_ID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	// 10.ค้นหา intimate ด้วย id
	if tx := entity.DB().Where("id = ?", friend.Intimate_ID).First(&intimate); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "intimate not found"})
		return
	}

	// 10.ค้นหา game ด้วย id
	if tx := entity.DB().Where("id = ?", friend.Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "intimate not found"})
		return
	}

	// 11: สร้าง Basket
	fri := entity.Friend{
		User_ID:        friend.User_ID,
		User_Friend_ID: friend.User_Friend_ID,
		Intimate_ID:    friend.Intimate_ID,
		Nickname:       friend.Nickname,
		Game_ID:        friend.Game_ID,
		Is_Hide:        friend.Is_Hide,
		Date:           friend.Date.Local(),
	}

	// ขั้นตอนการ validate ที่นำมาจาก unit test
	if _, err := govalidator.ValidateStruct(fri); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 12: บันทึก
	if err := entity.DB().Create(&fri).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": friend})
}

// GET /friend/:id
func GetFriend(c *gin.Context) {
	var friend []entity.Friend
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&friend); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "friend not found"})
		return

	}

	c.JSON(http.StatusOK, gin.H{"data": friend})
}

// GET /friends
func ListFriend(c *gin.Context) {
	var friend []entity.Friend

	if err := entity.DB().Preload("User").Preload("Intimate").Preload("Game").Raw("SELECT * FROM friends").Find(&friend).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": friend})
}

// GET /userfriend/:uid
func GetUserfriend(c *gin.Context) {
	var friend []entity.Friend
	uid := c.Param("uid")
	if err := entity.DB().Preload("User").Preload("User_Friend").Preload("Game").Preload("Intimate").Raw("SELECT * FROM friends WHERE user_id = ? AND is_hide = 0", uid).Find(&friend).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": friend})
}

// GET /hideuserfriend/:uid
func GetHideUserfriend(c *gin.Context) {
	var friend []entity.Friend
	uid := c.Param("uid")
	if err := entity.DB().Preload("User").Preload("User_Friend").Preload("Game").Preload("Intimate").Raw("SELECT * FROM friends WHERE user_id = ? AND is_hide = 1", uid).Find(&friend).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": friend})
}

// PATCH /friends
func UpdateFriend(c *gin.Context) {
	var friend entity.Friend

	if err := c.ShouldBindJSON(&friend); err != nil {
		//c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		//return
	}

	fri := entity.Friend{
		Intimate_ID: friend.Intimate_ID,
		Nickname:    friend.Nickname,
		Game_ID:     friend.Game_ID,
		Is_Hide:     friend.Is_Hide,
	}

	if err := entity.DB().Where("id = ?", friend.ID).Updates(&fri).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": fri})

}

// DELETE /friend/:id
func DeleteFriend(c *gin.Context) {
	var friend entity.Friend

	if err := c.ShouldBindJSON(&friend); err != nil {
		//c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		//return
	}

	if tx := entity.DB().Exec("DELETE FROM friends WHERE id = ?", friend.ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "basket not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": friend})

}
