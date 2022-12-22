package entity

import (
	"time"

	"gorm.io/gorm"
)

type Basket struct {
	gorm.Model
	Date time.Time
}
