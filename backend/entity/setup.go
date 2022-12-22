package entity

import (
	"gorm.io/gorm"

	"gorm.io/driver/sqlite"

	user "github.com/sut65/team13/entity/user" // ที่ต้อง import เนื่องจาก setup.go กับ schema มันอยู่คนละ folder
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
		&user.User{}, // ไม่ต่างจาก SA แค่ต้องเรียกใช้โดยการ import
	)

	db = database

}
