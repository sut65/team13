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

		// Banner
		&Banner{},

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
	User4 := User{
		Email: "test1@gmail.com",
	}
	db.Model(&User{}).Create(&User1)
	db.Model(&User{}).Create(&User2)
	db.Model(&User{}).Create(&User3)
	db.Model(&User{}).Create(&User4)

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
		Profile_Picture:     "data:image/jpeg;base64,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",
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
		Profile_Picture:     "data:image/png;base64,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",
		Gender_ID:           &Gen2.ID,
		Favorite_Game_ID:    &Storage3.ID,
		Is_Seller:           false,
	}
	User33 := User{
		Password:            "$2a$12$hRdKLZTUspkskzjZwBAb6eImCpHYIe48KSUGD83JrzHYx6aKfowb6",
		Profile_Name:        "JusSix",
		Profile_Description: "GGWP",
		Gender_ID:           &Gen1.ID,
		Favorite_Game_ID:    &Storage3.ID,
		Is_Seller:           false,
	}
	User44 := User{
		Password:            "$2a$12$hRdKLZTUspkskzjZwBAb6eImCpHYIe48KSUGD83JrzHYx6aKfowb6",
		Profile_Name:        "Test1",
		Profile_Description: "qwer",
		Gender_ID:           &Gen2.ID,
		Favorite_Game_ID:    &Storage3.ID,
		Is_Seller:           false,
	}
	db.Model(&User{}).Where("email = ?", User1.Email).Updates(&User11)
	db.Model(&User{}).Where("email = ?", User2.Email).Updates(&User22)
	db.Model(&User{}).Where("email = ?", User3.Email).Updates(&User33)
	db.Model(&User{}).Where("email = ?", User4.Email).Updates(&User44)

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
	//////////////////////////////////////////////// ห้ามสลับ
	Intimate1 := Intimate{
		Intimate_Name: "Know",
	}
	db.Model(&Intimate{}).Create(&Intimate1)
	////////////////////////////////////////////////
	Intimate2 := Intimate{
		Intimate_Name: "Bast Friend",
	}
	Intimate3 := Intimate{
		Intimate_Name: "Family",
	}
	Intimate4 := Intimate{
		Intimate_Name: "Forget",
	}
	db.Model(&Intimate{}).Create(&Intimate2)
	db.Model(&Intimate{}).Create(&Intimate3)
	db.Model(&Intimate{}).Create(&Intimate4)

	//Friend
	friend1 := Friend{
		User_ID:        &User1.ID,
		User_Friend_ID: &User2.ID,
		Intimate_ID:    &Intimate1.ID,
		Nickname:       "เบส",
		Game_ID:        &Game2.ID,
		Is_Hide:        false,
		Date:           time.Now(),
	}
	friend2 := Friend{
		User_ID:        &User2.ID,
		User_Friend_ID: &User1.ID,
		Intimate_ID:    &Intimate1.ID,
		Nickname:       "นนท์",
		Game_ID:        &Game2.ID,
		Is_Hide:        false,
		Date:           time.Now(),
	}
	friend3 := Friend{
		User_ID:        &User1.ID,
		User_Friend_ID: &User3.ID,
		Intimate_ID:    &Intimate1.ID,
		Nickname:       "ไบร์ท",
		Game_ID:        &Game2.ID,
		Is_Hide:        true,
		Date:           time.Now(),
	}
	friend4 := Friend{
		User_ID:        &User3.ID,
		User_Friend_ID: &User1.ID,
		Intimate_ID:    &Intimate1.ID,
		Nickname:       "นนท์",
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
		Name:     "Mark",
		Email:    "Admin",
		Password: "$2a$12$hRdKLZTUspkskzjZwBAb6eImCpHYIe48KSUGD83JrzHYx6aKfowb6",
	}
	db.Model(&Admin{}).Create(&admin1)

	//Banner
	banner1 := Banner{
		Description: "test",
		Edit_at:     time.Now(),
		User:        User1,
		Admin:       admin1,
		Game:        Game1,
	}
	db.Model(&Banner{}).Create(&banner1)
}
