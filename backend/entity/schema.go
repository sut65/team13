package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

// ---ระบบผู้ใช้(User)---
type Gender struct {
	gorm.Model
	Gender string
	User   []User  `gorm:"foreignKey:Gender_ID"`
	Admin  []Admin `gorm:"foreignKey:Gender_ID"` //admin gender
}

type User struct {
	// Normal User
	gorm.Model
	Email               string   `gorm:"uniqueIndex" valid:"email~รูปแบบ email ไม่ถูกต้อง,required~กรุณากรอก email"`
	Password            string   `valid:"minstringlength(8)~ความยาวรหัสผ่านต้องไม่ต่ำกว่า 8 ตัวอักษร,required~กรุณากรอกรหัสผ่าน"`
	Profile_Name        string   `valid:"maxstringlength(50)~ชื่อความยาวไม่เกิน 50 ตัวอักษร,required~กรุณากรอกชื่อ"`
	Profile_Description string   `valid:"maxstringlength(200)~Profile Description ความยาวไม่เกิน 200 ตัวอักษร"`
	Profile_Picture     string   `valid:"image_valid~รูปภาพไม่ถูกต้อง"`
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
	Game_Name              string      `gorm:"uniqueIndex" valid:"maxstringlength(30)~Name must not more than 30 character,required~Please Enter your Game Name"`
	Game_Price             uint        `valid:"range(0|100000)~ Price incorrect,required~Please enter price,int"` //` valid: InRangeInt(value, 0)`
	Game_description       string      `valid:"maxstringlength(200)~Description must not more than 200 character,required~Please Enter your Game Description"`
	Publish_Date           time.Time   `valid:"required~Date can be null ,IsnotPast~Date incorrect"`
	Seller_ID              *uint       `valid:"-"`
	Seller                 User        `gorm:"references:id" valid:"-" `
	Game_Status_ID         *uint       `valid:"-"`
	Game_Status            Game_Status `gorm:"references:id" valid:"-"`
	Type_Game_ID           *uint       `valid:"-"`
	Type_Game              Type_Game   `gorm:"references:id" valid:"-"`
	Rating_ID              *uint       `valid:"-"`
	Rating                 Rating      `gorm:"references:id" valid:"-"`
	Game_file              string      `valid:"url~Link incorrect ,required~Please Upload Game file"`
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
	Name    string `valid:"required~คุณไม่ได้ใส่ชื่อ,maxstringlength(50)~ชื่อความยาวไม่เกิน 50 ตัวอักษร"`
	Note    string
	Date    time.Time `valid:"DelayNow10Min~เวลาเป็นอดีต รีเฟชหน้าเว็บใหม่"`
	User_ID *uint     `valid:"-"`
	User    User      `gorm:"references:id" valid:"-"`
	Storage []Storage `gorm:"foreignKey:Collection_ID"`
}

type Storage struct {
	gorm.Model
	Game_ID            *uint      `valid:"-"`
	Game               Game       `gorm:"references:id" valid:"-"`
	User_ID            *uint      `valid:"-"`
	User               User       `gorm:"references:id" valid:"-"`
	Collection_ID      *uint      `valid:"-"`
	Collection         Collection `gorm:"references:id" valid:"-"`
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
	User_ID        *uint     `valid:"-"`
	User           User      `gorm:"references:id" valid:"-"`
	User_Friend_ID *uint     `valid:"-"`
	User_Friend    User      `gorm:"references:id" valid:"-"`
	Intimate_ID    *uint     `valid:"-"`
	Intimate       Intimate  `gorm:"references:id" valid:"-"`
	Nickname       string    `valid:"required~คุณไม่ได้ใส่ชื่อเล่น,maxstringlength(50)~ชื่อเล่นความยาวไม่เกิน 50 ตัวอักษร"`
	Game_ID        *uint     `valid:"-"`
	Game           Game      `gorm:"references:id" valid:"-"`
	Is_Hide        *bool     `valid:"ToBoolean~การซ่อนผิดพลาด"`
	Date           time.Time `valid:"DelayNow10Min~เวลาเป็นอดีต ลองโหลดหน้าเว็บอีกรอบ"`
	Order          []Order   `gorm:"foreignKey:Friend_ID"`
}

// ---ระบบตะกร้าสินค้า(Basket)---
type Payment_Status struct {
	gorm.Model
	Status string
	Basket []Basket `gorm:"foreignKey:Payment_Status_ID"`
}

type Basket struct {
	gorm.Model
	User_ID           *uint          `valid:"-"`
	User              User           `gorm:"references:id" valid:"-"`
	Game_ID           *uint          `valid:"-"`
	Game              Game           `gorm:"references:id" valid:"-"`
	Payment_Status_ID *uint          `valid:"-"`
	Payment_Status    Payment_Status `gorm:"references:id" valid:"-"`
	Note              string         `valid:"required~คุณไม่ได้ใส่โน๊ต,maxstringlength(200)~โน็ตความยาวไม่เกิน 200 ตัวอักษร"`
	Date              time.Time      `valid:"DelayNow10Min~เวลาเป็นอดีต ลองโหลดหน้าเว็บอีกรอบ"`
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
	Banner_Picture string    `valid:"image_valid~รูปภาพไม่ถูกต้อง,required~กรุณาอัปโหลดรูปภาพ"`
	Description    string    `valid:"maxstringlength(50)~Banner Description ความยาวไม่เกิน 50 ตัวอักษร"`
	Edit_at        time.Time `valid:"DelayNow10Min~เวลาห้ามเป็นอดีต"` // สามารถเป็นอดีตได้ไม่เกิน 9 นาที 59 วิ ถ้า 10 นาทีแล้วจะตรวจจับว่าผิด
	User_ID        *uint     `valid:"-"`
	User           User      `gorm:"references:id" valid:"-"`
	Admin_ID       *uint     `valid:"-"`
	Admin          Admin     `gorm:"references:id" valid:"-"`
	Game_ID        *uint     `valid:"-"`
	Game           Game      `gorm:"references:id" valid:"-"`
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
	Admin_ID               *uint               `valid:"-"`
	Admin                  Admin               `gorm:"references:id" valid:"-"`
	Order_ID               *uint               `valid:"-"`
	Order                  Order               `gorm:"references:id" valid:"-"`
	Verification_Status_ID *uint               `valid:"-"`
	Verification_Status    Verification_Status `gorm:"references:id" valid:"-"`
	Date                   time.Time
	Note                   string `valid:"required~Note cannot be blank"`
}

// ----ระบบ Wishlist---
type Wish_Level struct {
	gorm.Model
	Level    string
	Wishlist []Wishlist `gorm:"foreignKey:Wish_Level_ID"`
}
type Wishlist struct {
	gorm.Model
	Date time.Time `valid:"DelayNow10Min~เวลาเป็นอดีต รีเฟชหน้าเว็บใหม่"`
	Note string    `valid:"required~คุณไม่ได้ใส่โน็ต,maxstringlength(50)~โน็ตความยาวไม่เกิน 50 ตัวอักษร"`

	Game_ID *uint `valid:"-"`
	Game    Game  `gorm:"references:id" valid:"-"`

	User_ID *uint `valid:"-"`
	User    User  `gorm:"references:id" valid:"-"`

	Wish_Level_ID *uint      `valid:"-"`
	Wish_Level    Wish_Level `gorm:"references:id" valid:"-"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("IsFuture", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now())
	})

	govalidator.CustomTypeTagMap.Set("IsPresent", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().AddDate(0, 0, -1)) && t.Before(time.Now().AddDate(0, 0, 1))
	})

	govalidator.CustomTypeTagMap.Set("IsPast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.Before(time.Now())
	})

	govalidator.CustomTypeTagMap.Set("IsnotPast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().AddDate(0, 0, -1))
	})

	govalidator.CustomTypeTagMap.Set("DelayNow10Min", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute * -10))
	})

	govalidator.TagMap["image_valid"] = govalidator.Validator(func(str string) bool {
		return govalidator.Matches(str, "^(data:image(.+);base64,.+)$")
	})
}
