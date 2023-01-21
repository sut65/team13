package controller

import (
	"github.com/sut65/team13/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// GET /options

func ListOptions(c *gin.Context) {
	var options []entity.Option

	if err := entity.DB().Raw("SELECT * FROM options").Scan(&options).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": options})
}
