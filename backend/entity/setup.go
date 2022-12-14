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

		// Friend
		&Intimate{},
		&Friend{},

		// Admin
		&Admin{},
	)

	db = database

	// User for first declaration
	User1 := User{
		Email: "natt@gmail.com",
	}
	User2 := User{
		Email: "best@gmail.com",
	}
	User3 := User{
		Email: "patcharapolwor28112544@gmail.com",
	}
	db.Model(&User{}).Create(&User1)
	db.Model(&User{}).Create(&User2)
	db.Model(&User{}).Create(&User3)

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
		Game_Name:        "Elden Ring",
		Game_Price:       1500,
		Game_description: "Game of the year",
		Publish_Date:     time.Now(),
		Seller:           User1,
		Game_Status:      Game_Status1,
		Type_Game:        Type_Game1,
		Rating:           Rating1,
	}
	Game2 := Game{
		Game_Name:        "Batman Arkam Knights",
		Game_Price:       1200,
		Game_description: "Rich boy",
		Publish_Date:     time.Now(),
		Seller:           User1,
		Game_Status:      Game_Status1,
		Type_Game:        Type_Game1,
		Rating:           Rating1,
	}
	Game3 := Game{
		Game_Name:        "God of War",
		Game_Price:       1250,
		Game_description: "Game of the year 2018",
		Publish_Date:     time.Now(),
		Seller:           User1,
		Game_Status:      Game_Status1,
		Type_Game:        Type_Game1,
		Rating:           Rating1,
	}
	Game4 := Game{
		Game_Name:        "BattleField 2042",
		Game_Price:       1250,
		Game_description: "Worst of the year 2021",
		Publish_Date:     time.Now(),
		Seller:           User1,
		Game_Status:      Game_Status1,
		Type_Game:        Type_Game1,
		Rating:           Rating1,
	}
	db.Model(&Game{}).Create(&Game1)
	db.Model(&Game{}).Create(&Game2)
	db.Model(&Game{}).Create(&Game3)
	db.Model(&Game{}).Create(&Game4)

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
	Storage2 := Storage{
		Game:       Game2,
		User:       User1,
		Collection: Collection1,
	}
	Storage3 := Storage{
		Game:       Game1,
		User:       User2,
		Collection: Collection1,
	}
	db.Model(&Storage{}).Create(&Storage1)
	db.Model(&Storage{}).Create(&Storage2)
	db.Model(&Storage{}).Create(&Storage3)

	// User
	Gen1 := Gender{
		Gender: "male",
	}
	Gen2 := Gender{
		Gender: "female",
	}
	Gen3 := Gender{
		Gender: "other",
	}
	db.Model(&Gender{}).Create(&Gen1)
	db.Model(&Gender{}).Create(&Gen2)
	db.Model(&Gender{}).Create(&Gen3)

	User11 := User{
		Password:            "$2a$12$hRdKLZTUspkskzjZwBAb6eImCpHYIe48KSUGD83JrzHYx6aKfowb6",
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
	User22 := User{
		Password:            "$2a$12$hRdKLZTUspkskzjZwBAb6eImCpHYIe48KSUGD83JrzHYx6aKfowb6",
		Profile_Name:        "BEST",
		Profile_Description: "BIBI",
		Gender_ID:           &Gen2.ID,
		Favorite_Game_ID:    &Storage3.ID,
		Is_Seller:           false,
	}
	db.Model(&User{}).Where("email = ?", User1.Email).Updates(&User11)
	db.Model(&User{}).Where("email = ?", User2.Email).Updates(&User22)

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
		User_ID:           &User1.ID,
		Game_ID:           &Game1.ID,
		Payment_Status_ID: &Payment_Status2.ID,
		Note:              "Test1",
		Date:              time.Now(),
	}
	Basket2 := Basket{
		User_ID:           &User1.ID,
		Game_ID:           &Game2.ID,
		Payment_Status_ID: &Payment_Status1.ID,
		Note:              "Test2",
		Date:              time.Now(),
	}
	Basket3 := Basket{
		User_ID:           &User1.ID,
		Game_ID:           &Game3.ID,
		Payment_Status_ID: &Payment_Status1.ID,
		Note:              "Test3",
		Date:              time.Now(),
	}
	Basket4 := Basket{
		User_ID:           &User2.ID,
		Game_ID:           &Game4.ID,
		Payment_Status_ID: &Payment_Status1.ID,
		Note:              "Test4",
		Date:              time.Now(),
	}
	db.Model(&Basket{}).Create(&Basket1)
	db.Model(&Basket{}).Create(&Basket2)
	db.Model(&Basket{}).Create(&Basket3)
	db.Model(&Basket{}).Create(&Basket4)

	//Intimate
	Intimate1 := Intimate{
		Intimate_Name: "Bast Friend",
	}
	Intimate2 := Intimate{
		Intimate_Name: "Know",
	}
	Intimate3 := Intimate{
		Intimate_Name: "Family",
	}
	Intimate4 := Intimate{
		Intimate_Name: "Forget",
	}
	db.Model(&Intimate{}).Create(&Intimate1)
	db.Model(&Intimate{}).Create(&Intimate2)
	db.Model(&Intimate{}).Create(&Intimate3)
	db.Model(&Intimate{}).Create(&Intimate4)

	//Friend
	friend1 := Friend{
		User_ID:        &User1.ID,
		User_Friend_ID: &User2.ID,
		Intimate_ID:    &Intimate1.ID,
		Nickname:       "?????????",
		Game_ID:        &Game2.ID,
		Is_Hide:        false,
		Date:           time.Now(),
	}
	friend2 := Friend{
		User_ID:        &User2.ID,
		User_Friend_ID: &User1.ID,
		Intimate_ID:    &Intimate1.ID,
		Nickname:       "????????????",
		Game_ID:        &Game2.ID,
		Is_Hide:        false,
		Date:           time.Now(),
	}
	friend3 := Friend{
		User_ID:        &User1.ID,
		User_Friend_ID: &User3.ID,
		Intimate_ID:    &Intimate1.ID,
		Nickname:       "???????????????",
		Game_ID:        &Game2.ID,
		Is_Hide:        true,
		Date:           time.Now(),
	}
	friend4 := Friend{
		User_ID:        &User3.ID,
		User_Friend_ID: &User1.ID,
		Intimate_ID:    &Intimate1.ID,
		Nickname:       "????????????",
		Game_ID:        &Game2.ID,
		Is_Hide:        false,
		Date:           time.Now(),
	}
	db.Model(&Friend{}).Create(&friend1)
	db.Model(&Friend{}).Create(&friend2)
	db.Model(&Friend{}).Create(&friend3)
	db.Model(&Friend{}).Create(&friend4)

	//Admin
	admin1 := Admin{
		Email:    "Admin",
		Password: "$2a$12$hRdKLZTUspkskzjZwBAb6eImCpHYIe48KSUGD83JrzHYx6aKfowb6",
	}
	db.Model(&Admin{}).Create(&admin1)
}
