package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut65/team13/entity"
)

/* --- ระบบ Login ---*/
// GET /login
func ListAdminLogin(c *gin.Context) {
	var admin []entity.Admin

	if err := entity.DB().Raw("SELECT * FROM admins").Scan(&admin).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": admin})
}
