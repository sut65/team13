package unit_test

import (
	"testing"

	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
	"github.com/sut65/team13/entity"
)

func TestAdminValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	Admin := entity.Admin{ // set up data for test
		Name:            "nat",
		Email:           "nat@nat.com",
		Password:        "12345678",
		Address:         "1111111",
		Profile_Picture: "data:image/jpeg;base64,/9jdasddsawegdasd/asdger",
	}

	t.Run("the data is correct", func(t *testing.T) {
		adminTest := Admin

		ok, err := govalidator.ValidateStruct(adminTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})

	t.Run("email format invalid", func(t *testing.T) {
		adminTest := Admin
		adminTest.Email = "aaa@aaa"

		ok, err := govalidator.ValidateStruct(adminTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Format email incorrect")) // check error message
	})

	t.Run("email can not be blank", func(t *testing.T) {
		adminTest := Admin
		adminTest.Email = ""

		ok, err := govalidator.ValidateStruct(adminTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Please enter email")) // check error message
	})

	t.Run("password min length is 8", func(t *testing.T) {
		adminTest := Admin
		adminTest.Password = "1234567"

		ok, err := govalidator.ValidateStruct(adminTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Name must be more than  8 character")) // check error message
	})

	t.Run("password can not be blank", func(t *testing.T) {
		adminTest := Admin
		adminTest.Password = ""

		ok, err := govalidator.ValidateStruct(adminTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Please Enter password")) // check error message
	})

	t.Run("Name max length is 30", func(t *testing.T) {
		adminTest := Admin
		adminTest.Name = "1234567890 1234567890 1234567890 1234567890 1234567890"

		ok, err := govalidator.ValidateStruct(adminTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Name must be less than  30 character")) // check error message
	})

	t.Run("Name can not be blank", func(t *testing.T) {
		adminTest := Admin
		adminTest.Name = ""

		ok, err := govalidator.ValidateStruct(adminTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Please Enter Name")) // check error message
	})

	t.Run("Address max length is 100", func(t *testing.T) {
		adminTest := Admin
		adminTest.Address = "1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 "

		ok, err := govalidator.ValidateStruct(adminTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Address must not more than 100 character")) // check error message
	})

	t.Run("picture is null", func(t *testing.T) {
		adminTest := Admin
		adminTest.Profile_Picture = ""

		ok, err := govalidator.ValidateStruct(adminTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Please upload Picture")) // check error message
	})
	t.Run("picture is incorrect", func(t *testing.T) {
		adminTest := Admin
		adminTest.Profile_Picture = "asdas"

		ok, err := govalidator.ValidateStruct(adminTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Picture incorrect")) // check error message
	})
}
