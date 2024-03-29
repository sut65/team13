package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)
	"gorm.io/gorm"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /users

func CreateStroage(c *gin.Context) {

	// Storage Create
	var payment_ver entity.Payment_Verification
	if err := c.ShouldBindJSON(&payment_ver); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// if *payment_ver.Verification_Status_ID == 3 {
	var basket []entity.Basket

	//Send_gift
	if err := entity.DB().Raw("SELECT * FROM baskets WHERE order_id = ?", payment_ver.Order_ID).Find(&basket).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for i := 0; i < len(basket); i++ {
		var games entity.Game
		var user entity.User
		var order entity.Order

		if tx := entity.DB().Where("id = ?", payment_ver.Order_ID).First(&order); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Order not found"})
			return
		}

		if tx := entity.DB().Where("id = ?", basket[i].Game_ID).First(&games); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Game not found"})
			return
		}

		if tx := entity.DB().Where("id = ?", basket[i].User_ID).First(&user); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
			return
		}
		if order.Friend_ID != nil {
			println("send gift")
			var friend entity.Friend
			if err := entity.DB().Raw("SELECT * FROM friends WHERE id = ?", order.Friend_ID).Find(&friend).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			st := entity.Storage{
				User_ID: friend.User_Friend_ID,
				Game_ID: basket[i].Game_ID,
			}

			// 13: บันทึก
			if err := entity.DB().Create(&st).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			// c.JSON(http.StatusCreated, gin.H{"data": st})

		} else {
			println("not send")

			st := entity.Storage{
				User_ID: basket[i].User_ID,
				Game_ID: basket[i].Game_ID,
			}

			// 13: บันทึก
			if err := entity.DB().Create(&st).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusCreated, gin.H{"data": st})

		}

	}
	// }
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
	var game entity.Game

	// มี prelaod เพื่อใช้โหลดให้ระบบ user

	if err := entity.DB().Preload("Game", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "deleted_at", "game_name", "game_price", "game_description", "publish_date", "seller_id", "game_status_id", "type_game_id", "rating_id", "game_picture").Where("deleted_at IS NULL").Find(&game)
	}).Raw("SELECT * FROM storages WHERE deleted_at IS NULL").Find(&storages).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": storages})

}

// GET /ALLstorages // ไม่สนใจ deleted_at เอาทุกตัวขึ้นมา
func ListALLStorages(c *gin.Context) {

	var storages []entity.Storage
	var game entity.Game

	if err := entity.DB().Preload("Game", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "deleted_at", "game_name", "game_price", "game_description", "publish_date", "seller_id", "game_status_id", "type_game_id", "rating_id", "game_picture").Find(&game)
	}).Raw("SELECT * FROM storages").Find(&storages).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": storages})

}

// List //Storages by user
func ListStoragesUser(c *gin.Context) {

	var storages []entity.Storage
	var game entity.Game
	id := c.Param("id")

	// มี prelaod เพื่อใช้โหลดให้ระบบ Storages
	if err := entity.DB().Preload("Game", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "deleted_at", "game_name", "game_price", "game_description", "publish_date", "seller_id", "game_status_id", "type_game_id", "rating_id", "game_picture").Find(&game)
	}).Preload("User").Preload("Collection").Raw("SELECT * FROM storages WHERE user_id = ? AND deleted_at IS NULL ", id).Find(&storages).Error; err != nil {

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

	if tx := entity.DB().Where("id = ?", storage.ID).Delete(&entity.Storage{}); tx.RowsAffected == 0 {

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

func GetBasketByOrderID(c *gin.Context) {

	var basket entity.Basket

	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM baskets WHERE Order_ID = ?", id).Scan(&basket).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": basket})

}
