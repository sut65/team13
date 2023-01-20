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
	var User_Friend entity.User
	var intimate entity.Intimate
	var game entity.Game

	if err := c.ShouldBindJSON(&friend); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Raw("SELECT * FROM friends WHERE user_id = ? AND user_friend_id = ?", friend.User_ID, friend.User_Friend_ID).First(&friend); tx.RowsAffected == 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "already friends"})
		return
	}

	if tx := entity.DB().Where("id = ?", friend.User_Friend_ID).First(&User_Friend); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", friend.Intimate_ID).First(&intimate); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "intimate not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", friend.Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "game not found"})
		return
	}

	friAdd := entity.Friend{
		User_ID:        friend.User_ID,
		User_Friend_ID: friend.User_Friend_ID,
		Intimate_ID:    friend.Intimate_ID,
		Nickname:       friend.Nickname,
		Game_ID:        friend.Game_ID,
		Is_Hide:        friend.Is_Hide,
		Date:           friend.Date.Local(),
	}

	if _, err := govalidator.ValidateStruct(friAdd); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&friAdd).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	friAdded := entity.Friend{
		User_ID:        friend.User_Friend_ID,
		User_Friend_ID: friend.User_ID,
		Intimate_ID:    friend.Intimate_ID,
		Game_ID:        friend.Game_ID,
		Is_Hide:        friend.Is_Hide,
		Date:           friend.Date.Local(),
	}

	if _, err := govalidator.ValidateStruct(friAdded); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&friAdded).Error; err != nil {

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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fri := entity.Friend{
		Intimate_ID: friend.Intimate_ID,
		Nickname:    friend.Nickname,
		Game_ID:     friend.Game_ID,
		Is_Hide:     friend.Is_Hide,
	}

	println(friend.Is_Hide)
	println(fri.Is_Hide)
	println(friend.ID)

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
