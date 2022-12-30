package entity

import (
	"time"

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
		// User
		&Gender{},
		&User{},

		// Game
		&Game_Status{},
		&Type_Game{},
		&Rating{},
		&Game{},

		// Storage
		&Collection{},
		&Storage{},

		// Basket
		&Payment_Status{},
		&Basket{},
	)

	db = database

	// User for first declaration
	User1 := User{
		Email: "natt@gmail.com",
	}
	db.Model(&User{}).Create(&User1)

	// Game
	Game_Status1 := Game_Status{
		Status_Type: "Available",
	}
	Game_Status2 := Game_Status{
		Status_Type: "Not Available",
	}
	db.Model(&Game_Status{}).Create(&Game_Status1)
	db.Model(&Game_Status{}).Create(&Game_Status2)

	Type_Game1 := Type_Game{
		Type_Game_Name: "RPG",
	}
	Type_Game2 := Type_Game{
		Type_Game_Name: "Action",
	}
	db.Model(&Type_Game{}).Create(&Type_Game1)
	db.Model(&Type_Game{}).Create(&Type_Game2)

	Rating1 := Rating{
		Rating_Name: "18+",
	}
	Rating2 := Rating{
		Rating_Name: "15+",
	}
	db.Model(&Rating{}).Create(&Rating1)
	db.Model(&Rating{}).Create(&Rating2)

	Game1 := Game{
		Game_Name:    "Elden Ring",
		Publish_Date: time.Now(),
		Seller:       User1,
		Game_Status:  Game_Status1,
		Type_Game:    Type_Game1,
		Rating:       Rating1,
	}
	Game2 := Game{
		Game_Name:    "Batman Arkam Knights",
		Publish_Date: time.Now(),
		Seller:       User1,
		Game_Status:  Game_Status1,
		Type_Game:    Type_Game1,
		Rating:       Rating1,
	}
	db.Model(&Game{}).Create(&Game1)
	db.Model(&Game{}).Create(&Game2)

	// Storage

	Collection1 := Collection{
		Name: "fav",
	}
	db.Model(&Collection{}).Create(&Collection1)

	Storage1 := Storage{
		Game:       Game1,
		User:       User1,
		Collection: Collection1,
	}
	db.Model(&Storage{}).Create(&Storage1)

	// User
	Gen1 := Gender{
		Gender: "male",
	}
	Gen2 := Gender{
		Gender: "female",
	}
	db.Model(&Gender{}).Create(&Gen1)
	db.Model(&Gender{}).Create(&Gen2)

	User11 := User{
		Password:            "1234",
		Profile_Name:        "Udong",
		Profile_Description: "eiei",
		Gender_ID:           &Gen1.ID,
		Favorite_Game_ID:    &Storage1.ID,
		// Gender:               Gen1, // This way is not work for USER, But why?
		// Favorite_Game:        &Storage1, // maybe because .Updates in gorm framwork
		Is_Seller:            true,
		Store_Description:    "eiei",
		Out_Standing_Game_ID: &Game1.ID,
		Store_Contact:        "natt@gmail.com",
	}
	//db.Model(&User{}).Save(&User1)
	db.Model(&User{}).Where("email = ?", User1.Email).Updates(&User11)

	//Payment_Status
	Payment_Status1 := Payment_Status{
		Status: "Unpaid",
	}
	Payment_Status2 := Payment_Status{
		Status: "Paid",
	}
	db.Model(&Payment_Status{}).Create(&Payment_Status1)
	db.Model(&Payment_Status{}).Create(&Payment_Status2)

	//Basket
	Basket1 := Basket{
		User_ID:           Storage1.User_ID,
		Game_ID:           &Game1.ID,
		Payment_Status_ID: &Payment_Status1.ID,
		Note:              "Test1",
		Date:              time.Now(),
	}
	Basket2 := Basket{
		User_ID:           Storage1.User_ID,
		Game_ID:           &Game2.ID,
		Payment_Status_ID: &Payment_Status1.ID,
		Note:              "Test2",
		Date:              time.Now(),
	}
	db.Model(&Basket{}).Create(&Basket1)
	db.Model(&Basket{}).Create(&Basket2)
}
