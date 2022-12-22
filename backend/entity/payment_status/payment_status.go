package entity

import (
	"gorm.io/gorm"
)

type Payment_Status struct {
	gorm.Model
	Status string
}
