package entity

import (
	"time"

	"gorm.io/gorm"
)

// ---ระบบผู้ใช้(User)---
type User struct {
	gorm.Model
	FirstName string
	LastName  string
	Email     string
	Age       uint8
	BirthDay  time.Time
	Basket    []Basket `gorm:"foreignKey:User_ID"`
}

type Gender struct {
	gorm.Model
	Gender string
}

// ---ระบบคลังเกม(Storage)---

// ---ระบบตะกร้าสินค้า(Basket)---
type Payment_Status struct {
	gorm.Model
	Status string
	Basket []Basket `gorm:"foreignKey:Payment_Status_ID"`
}

type Basket struct {
	gorm.Model
	User_ID *uint
	User    User `gorm:"references:id"`
	//Game_ID *uint
	//Game	Game `gorm:"references:id"`
	Payment_Status_ID *uint
	Payment_Status    Payment_Status `gorm:"references:id"`
	Note              string
	Date              time.Time
}
