package entity

import (
	"gorm.io/gorm"

	"gorm.io/driver/sqlite"
)

var db *gorm.DB

func DB() *gorm.DB {

	return db

}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("game-store.db"), &gorm.Config{})

	if err != nil {

		panic("failed to connect database")

	}

	// Migrate the schema

	database.AutoMigrate(
		//ระบบผู้ใช้(User)
		&User{},

		//ระบบตะกร้าสินค้า
		&Payment_Status{},
		&Basket{},
	)

	db = database

}
