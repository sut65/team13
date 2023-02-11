package controller

import (
	"github.com/asaskevich/govalidator"
	"github.com/sut65/team13/entity" // เรียกเพื่อเรียกใช้ฟังก์ชั่นใน setup.go (มันจะถูก declare อัตโนมัติว่าตัวมันเองเป็น entity)

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /topgames

func CreateTopgame(c *gin.Context) {

	var topgame entity.Topgame
	var ranking entity.Ranking
	var admin entity.Admin
	var game entity.Game

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร repair
	if err := c.ShouldBindJSON(&topgame); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา ranking ด้วย id
	if tx := entity.DB().Where("id = ?", topgame.Ranking_ID).First(&ranking); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ranking not found"})
		return
	}

	// 10: ค้นหา game ด้วย id
	if tx := entity.DB().Where("id = ?", topgame.Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "game not found"})
		return
	}

	// 11: ค้นหา admin ด้วย id
	if tx := entity.DB().Where("id = ?", topgame.Admin_ID).First(&admin); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "admin not found"})
		return
	}
	// // 12: สร้าง topgame
	bk := entity.Topgame{
		Comment: topgame.Comment,
		Date:    topgame.Date,
		Ranking: ranking, // โยงความสัมพันธ์กับ Entity ranking
		Game:    game,    // โยงความสัมพันธ์กับ Entity game
		Admin:   admin,   // โยงความสัมพันธ์กับ Entity admin
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

// GET /topgame/:id

func GetTopgame(c *gin.Context) {

	var topgame entity.Topgame

	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM Topgames WHERE id = ?", id).Scan(&topgame).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": topgame})

}

// GET /topgame

func ListTopgames(c *gin.Context) {
	var topgame []entity.Topgame
	if err := entity.DB().Preload("Ranking").Preload("Game").Preload("Admin").Raw("SELECT * FROM Topgames").Find(&topgame).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": topgame})
}

// DELETE /topgame/:id
func DeleteTopgame(c *gin.Context) {
	id := c.Param("id")

	if tx := entity.DB().Exec("DELETE FROM topgames WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "topgame not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /topgames

func UpdateTopgame(c *gin.Context) {
	var topgame entity.Topgame
	var ranking entity.Ranking
	var admin entity.Admin
	var game entity.Game

	if err := c.ShouldBindJSON(&topgame); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", topgame.Ranking_ID).First(&ranking); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือก อันดับ"})
		return
	}

	if tx := entity.DB().Where("id = ?", topgame.Admin_ID).First(&admin); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือก Editor"})
		return
	}

	if tx := entity.DB().Where("id = ?", topgame.Game_ID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือก Game"})
		return
	}

	updateTopgame := entity.Topgame{
		Comment: topgame.Comment,
		Date:    topgame.Date,
		Ranking: ranking, // โยงความสัมพันธ์กับ Entity ranking
		Game:    game,    // โยงความสัมพันธ์กับ Entity game
		Admin:   admin,   // โยงความสัมพันธ์กับ Entity admin
	}

	if err := entity.DB().Where("id = ?", topgame.ID).Updates(&updateTopgame).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": topgame})
}
