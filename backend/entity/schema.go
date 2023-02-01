package entity

import (
	"time"

	"gorm.io/gorm"
)

// ---ระบบผู้ใช้(User)---
type Gender struct {
	gorm.Model
	Gender string
	User   []User `gorm:"foreignKey:Gender_ID"`
}

type User struct {
	// Normal User
	gorm.Model
	Email               string   `gorm:"uniqueIndex" valid:"email~รูปแบบ email ไม่ถูกต้อง,required~กรุณากรอก email"`
	Password            string   `valid:"minstringlength(8)~ความยาวรหัสผ่านต้องไม่ต่ำกว่า 8 ตัวอักษร,required~กรุณากรอกรหัสผ่าน"`
	Profile_Name        string   `valid:"maxstringlength(50)~ชื่อความยาวไม่เกิน 50 ตัวอักษร,required~กรุณากรอกชื่อ"`
	Profile_Description string   `valid:"maxstringlength(200)~Profile Description ความยาวไม่เกิน 200 ตัวอักษร"`
	Profile_Picture     string   `valid:"matches((data:image(.+);base64.+))~รูปภาพไม่ถูกต้อง"` // ยังใช้ไม่ได้
	Gender_ID           *uint    `valid:"-"`
	Gender              Gender   `gorm:"references:id" valid:"-"`
	Favorite_Game_ID    *uint    `valid:"-"`
	Favorite_Game       *Storage `gorm:"references:id" valid:"-"` // ใช้ pointer เพื่อป้องกันไม่ให้เกิด error invalid cycle declaration , ตั้งชื่อหน้าหลังไม่เหมือนกันจะบัคไหมนะ?
	// Game Store User
	Is_Seller            bool
	Store_Description    string       `valid:"maxstringlength(200)~Store Description ความยาวไม่เกิน 200 ตัวอักษร"`
	Out_Standing_Game_ID *uint        `valid:"-"`
	Out_Standing_Game    *Game        `gorm:"references:id" valid:"-"` // ใช้ pointer เพื่อป้องกันไม่ให้เกิด error invalid cycle declaration , ตั้งชื่อหน้าหลังไม่เหมือนกันจะบัคไหมนะ?
	Store_Contact        string       `valid:"maxstringlength(100)~Store Contact ความยาวไม่เกิน 100 ตัวอักษร"`
	Basket               []Basket     `gorm:"foreignKey:User_ID"`
	Friend               []Friend     `gorm:"foreignKey:User_ID"`
	User_Friend          []Friend     `gorm:"foreignKey:User_Friend_ID"`
	Game                 []Game       `gorm:"foreignKey:Seller_ID"`
	Storage              []Storage    `gorm:"foreignKey:User_ID"`
	Banner               []Banner     `gorm:"foreignKey:User_ID"`
	Collection           []Collection `gorm:"foreignKey:User_ID"`
	Order                []Order      `gorm:"foreignKey:User_ID"`
	Wishlist             []Wishlist   `gorm:"foreignKey:User_ID"`
}

// ---ระบบขายเกม(Game)---
type Game_Status struct {
	gorm.Model
	Status_Type string
	Game        []Game `gorm:"foreignKey:Game_Status_ID"`
}

type Type_Game struct {
	gorm.Model
	Type_Game_Name string
	Game           []Game `gorm:"foreignKey:Type_Game_ID"`
}

type Rating struct {
	gorm.Model
	Rating_Name string
	Game        []Game `gorm:"foreignKey:Rating_ID"`
}

type Game struct {
	gorm.Model
	Game_Name              string `gorm:"uniqueIndex"`
	Game_Price             uint
	Game_description       string
	Publish_Date           time.Time
	Seller_ID              *uint
	Seller                 User `gorm:"references:id"`
	Game_Status_ID         *uint
	Game_Status            Game_Status `gorm:"references:id"`
	Type_Game_ID           *uint
	Type_Game              Type_Game `gorm:"references:id"`
	Rating_ID              *uint
	Rating                 Rating `gorm:"references:id"`
	Game_file              string
	Game_Picture           string
	Storage                []Storage  `gorm:"foreignKey:Game_ID"`
	User_Out_Standing_Game []User     `gorm:"foreignKey:Out_Standing_Game_ID"`
	Basket                 []Basket   `gorm:"foreignKey:Game_ID"`
	Friend                 []Friend   `gorm:"foreignKey:Game_ID"`
	Banner                 []Banner   `gorm:"foreignKey:Game_ID"`
	Wishlist               []Wishlist `gorm:"foreignKey:Game_ID"`
}

// ---ระบบคลังเกม(Storage)---
type Collection struct {
	gorm.Model
	Name    string
	Note    string
	Date    time.Time
	User_ID *uint
	User    User      `gorm:"references:id"`
	Storage []Storage `gorm:"foreignKey:Collection_ID"`
}

type Storage struct {
	gorm.Model
	Game_ID            *uint
	Game               Game `gorm:"references:id"`
	User_ID            *uint
	User               User `gorm:"references:id"`
	Collection_ID      *uint
	Collection         Collection `gorm:"references:id"`
	User_Favorite_Game []User     `gorm:"foreignKey:Favorite_Game_ID"`
}

// ---ระบบเพื่อน(Friend)---
type Intimate struct {
	gorm.Model
	Intimate_Name string
	Friend        []Friend `gorm:"foreignKey:Intimate_ID"`
}

type Friend struct {
	gorm.Model
	User_ID        *uint
	User           User `gorm:"references:id"`
	User_Friend_ID *uint
	User_Friend    User `gorm:"references:id"`
	Intimate_ID    *uint
	Intimate       Intimate `gorm:"references:id"`
	Nickname       string
	Game_ID        *uint
	Game           Game `gorm:"references:id"`
	Is_Hide        *bool
	Date           time.Time
	Order          []Order `gorm:"foreignKey:Friend_ID"`
}

// ---ระบบตะกร้าสินค้า(Basket)---
type Payment_Status struct {
	gorm.Model
	Status string
	Basket []Basket `gorm:"foreignKey:Payment_Status_ID"`
}

type Basket struct {
	gorm.Model
	User_ID           *uint `valid:"-"`
	User              User  `gorm:"references:id" valid:"-"`
	Game_ID           *uint `valid:"-"`
	Game              Game  `gorm:"references:id" valid:"-"`
	Payment_Status_ID *uint
	Payment_Status    Payment_Status `gorm:"references:id"`
	Note              string         `valid:"required~ตุณไม่ได้ใส่โน๊ต,maxstringlength(200)~โน็ตความยาวไม่เกิน 50 ตัวอักษร"`
	Date              time.Time      `valid:"required"`
	Order_ID          *uint          `valid:"-"`
	Order             Order          `gorm:"references:id" valid:"-"`
}

// ---ระบบรีวิวเกม(GameReview)---
type Review struct {
	gorm.Model
	User_ID *uint
	User    User `gorm:"references:id"`
	Game_ID *uint
	Game    Game `gorm:"references:id"`
	Star_ID *uint
	Star    Star `gorm:"references:id"`
	Comment string
	Date    time.Time
}

type Star struct {
	gorm.Model
	Detail string
	Review []Review `gorm:"foreignKey:Star_ID"`
}

// ---ระบบ Admin---
type Department struct {
	gorm.Model
	Department_Title string
	Admin            []Admin `gorm:"foreignKey:Department_ID"`
}
type Province struct {
	gorm.Model
	Province_Title string
	Admin          []Admin `gorm:"foreignKey:Province_ID"`
}
type Admin struct {
	// Normal User
	gorm.Model
	Name            string
	Email           string `gorm:"uniqueIndex"`
	Password        string
	Address         string
	Gender_ID       *uint
	Gender          Gender `gorm:"references:id"`
	Department_ID   *uint
	Department      Department `gorm:"references:id"`
	Province_ID     *uint
	Province        Province `gorm:"references:id"`
	Profile_Picture string

	Banner               []Banner               `gorm:"foreignKey:Admin_ID"`
	Payment_Verification []Payment_Verification `gorm:"foreignKey:Admin_ID"`
}

// ---ระบบ Banner---
type Banner struct {
	// Normal User
	gorm.Model
	Banner_Picture string
	Description    string
	Edit_at        time.Time
	User_ID        *uint
	User           User `gorm:"references:id"`
	Admin_ID       *uint
	Admin          Admin `gorm:"references:id"`
	Game_ID        *uint
	Game           Game `gorm:"references:id"`
}

// ---ระบบจัดอันดับเกม(TopGame)---
type Topgame struct {
	gorm.Model
	Admin_ID   *uint
	Admin      Admin `gorm:"references:id"`
	Game_ID    *uint
	Game       Game `gorm:"references:id"`
	Ranking_ID *uint
	Ranking    Ranking `gorm:"references:id"`
	Comment    string
	Date       time.Time
}

type Ranking struct {
	gorm.Model
	Detail  string
	Topgame []Topgame `gorm:"foreignKey:Ranking_ID"`
}

// ---ระบบสั่งซื้อเกม---
type Option struct {
	gorm.Model
	Option_name string
	Order       []Order `gorm:"foreignKey:Option_ID"`
}

type Order struct {
	gorm.Model
	User_ID                *uint
	User                   User `gorm:"references:id"`
	Option_ID              *uint
	Option                 Option `gorm:"references:id"`
	Verification_Status_ID *uint
	Verification_Status    Verification_Status `gorm:"references:id"`
	Slip                   string
	Date                   time.Time
	Send_gift              *bool
	Friend_ID              *uint
	Friend                 Friend `gorm:"references:id"`

	Basket               []Basket               `gorm:"foreignKey:Order_ID"`
	Payment_Verification []Payment_Verification `gorm:"foreignKey:Order_ID"`
}

//----ระบบตรวจสอบการชำระเงิน---

type Verification_Status struct {
	gorm.Model
	Status_type string

	Order                []Order                `gorm:"foreignKey:Verification_Status_ID"`
	Payment_Verification []Payment_Verification `gorm:"foreignKey:Verification_Status_ID"`
}

type Payment_Verification struct {
	gorm.Model
	Admin_ID               *uint
	Admin                  Admin `gorm:"references:id"`
	Order_ID               *uint
	Order                  Order `gorm:"references:id"`
	Verification_Status_ID *uint
	Verification_Status    Verification_Status `gorm:"references:id"`
	Date                   time.Time
	Note                   string
}

// ----ระบบ Wishlist---
type Wish_Level struct {
	gorm.Model
	Level    string
	Wishlist []Wishlist `gorm:"foreignKey:Wish_Level_ID"`
}
type Wishlist struct {
	gorm.Model
	Date time.Time
	Note string

	Game_ID *uint
	Game    Game `gorm:"references:id"`

	User_ID *uint
	User    User `gorm:"references:id"`

	Wish_Level_ID *uint
	Wish_Level    Wish_Level `gorm:"references:id"`
}
