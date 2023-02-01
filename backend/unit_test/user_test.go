package unit_test

import (
	"testing"

	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
	"github.com/sut65/team13/entity"
)

func TestUserValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	user := entity.User{ // set up data for test
		Email:               "123@123.com",
		Password:            "12345678",
		Profile_Name:        "Udong",
		Profile_Description: "eiei",
		Profile_Picture:     "data:image/jpeg;base64,/9j/4AAQ/AndSoOn", // ปกติจะยาวกว่านี้แต่อันนี้เอามาเทสสั้นๆ
		Store_Description:   "eiei",
		Store_Contact:       "natt@gmail.com",
	}

	t.Run("the data is correct", func(t *testing.T) {
		uTest := user

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})

	t.Run("email format invalid", func(t *testing.T) {
		uTest := user
		uTest.Email = "123@123"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("รูปแบบ email ไม่ถูกต้อง")) // check error message
	})

	t.Run("email can not be blank", func(t *testing.T) {
		uTest := user
		uTest.Email = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("กรุณากรอก email")) // check error message
	})

	t.Run("password min length is 8", func(t *testing.T) {
		uTest := user
		uTest.Password = "1234567"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("ความยาวรหัสผ่านต้องไม่ต่ำกว่า 8 ตัวอักษร")) // check error message
	})

	t.Run("password can not be blank", func(t *testing.T) {
		uTest := user
		uTest.Password = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("กรุณากรอกรหัสผ่าน")) // check error message
	})

	t.Run("profile_name max length is 50", func(t *testing.T) {
		uTest := user
		uTest.Profile_Name = "1234567890 1234567890 1234567890 1234567890 1234567890" // 54 ตัวอักษร

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("ชื่อความยาวไม่เกิน 50 ตัวอักษร")) // check error message
	})

	t.Run("profile_name can not be blank", func(t *testing.T) {
		uTest := user
		uTest.Profile_Name = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("กรุณากรอกชื่อ")) // check error message
	})

	t.Run("profile_description max length is 200", func(t *testing.T) {
		uTest := user
		uTest.Profile_Description = "1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890" // 219 ตัวอักษร

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Profile Description ความยาวไม่เกิน 200 ตัวอักษร")) // check error message
	})

	t.Run("picture is valid", func(t *testing.T) {
		uTest := user
		uTest.Profile_Picture = "test"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("รูปภาพไม่ถูกต้อง")) // check error message
	})

	t.Run("store_description max length is 200", func(t *testing.T) {
		uTest := user
		uTest.Store_Description = "1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890" // 219 ตัวอักษร

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Store Description ความยาวไม่เกิน 200 ตัวอักษร")) // check error message
	})

	t.Run("store_description max length is 200", func(t *testing.T) {
		uTest := user
		uTest.Store_Contact = "1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890" // 219 ตัวอักษร

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Store Contact ความยาวไม่เกิน 100 ตัวอักษร")) // check error message
	})
}
