package controller

import (
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /reviews

func CreateReview(c *gin.Context) {

	var review entity.Review
	var star entity.Star
	var user entity.User
	var game entity.Game

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร repair
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา star ด้วย id
	if tx := entity.DB().Where("id = ?", review.Star_ID).First(&star); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "star not found"})
		return
	}

	// 10: ค้นหา game ด้วย id
	if tx := entity.DB().Where("id = ?", review.Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "game not found"})
		return
	}

	// 11: ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", review.User_ID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}
	// // 12: สร้าง Repair
	bk := entity.Review{
		Comment: review.Comment,
		Date:    review.Date,
		Star:    star, // โยงความสัมพันธ์กับ Entity star
		Game:    game, // โยงความสัมพันธ์กับ Entity game
		User:    user, // โยงความสัมพันธ์กับ Entity user
	}

	// 13: บันทึก
	if err := entity.DB().Create(&bk).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": bk})
}

// GET /review/:id

func GetReview(c *gin.Context) {

	var review entity.Review

	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM Reviews WHERE id = ?", id).Scan(&review).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": review})

}

// GET /review

func ListReviews(c *gin.Context) {
	var review []entity.Review
	if err := entity.DB().Preload("Star").Preload("Game").Preload("User").Raw("SELECT * FROM Reviews").Find(&review).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": review})
}

// DELETE /review/:id
func DeleteReview(c *gin.Context) {
	id := c.Param("id")

	if tx := entity.DB().Exec("DELETE FROM Reviews WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "review not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /reviews

func UpdateReview(c *gin.Context) {
	var review entity.Review
	var star entity.Star
	var user entity.User
	var game entity.Game

	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", review.Star_ID).First(&star); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือก อันดับ"})
		return
	}

	if tx := entity.DB().Where("id = ?", review.User_ID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือก Editor"})
		return
	}

	if tx := entity.DB().Where("id = ?", review.Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือก Game"})
		return
	}

	updateReview := entity.Review{
		Comment: review.Comment,
		Date:    review.Date.Local(),
		Star:    star, // โยงความสัมพันธ์กับ Entity star
		Game:    game, // โยงความสัมพันธ์กับ Entity game
		User:    user, // โยงความสัมพันธ์กับ Entity user
	}

	if err := entity.DB().Where("id = ?", review.ID).Updates(&updateReview).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": review})
}
