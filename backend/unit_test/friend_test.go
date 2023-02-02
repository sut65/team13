package unit_test

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
	"github.com/sut65/team13/entity"
)

func TestFriendValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	//var t = true
	var f = false
	friend := entity.Friend{
		Nickname: "Jj",
		Is_Hide:  &f,
		Date:     time.Now().Add(time.Second * -599),
	}

	t.Run("the data is correct", func(t *testing.T) {
		fTest := friend

		ok, err := govalidator.ValidateStruct(fTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})

	t.Run("nickname invalid(null)", func(t *testing.T) {
		fTest := friend
		fTest.Nickname = ""

		ok, err := govalidator.ValidateStruct(fTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("คุณไม่ได้ใส่ชื่อเล่น")) // check error message
	})

	t.Run("nickname invalid(>50)", func(t *testing.T) {
		fTest := friend
		fTest.Nickname = "111111111111111111111111111111111111111111111111111"

		ok, err := govalidator.ValidateStruct(fTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("ชื่อเล่นความยาวไม่เกิน 50 ตัวอักษร")) // check error message
	})

	// Is_Hide เทสไม่ได้
	// t.Run("Is_Hide invalid(string)", func(t *testing.T) {
	// 	fTest := friend
	// 	var testBoolean = "1"
	// 	fTest.Is_Hide = &testBoolean

	// 	ok, err := govalidator.ValidateStruct(fTest)

	// 	g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

	// 	g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

	// 	g.Expect(err.Error()).To(gomega.Equal("การซ่อนผิดพลาด")) // check error message
	// })

	// t.Run("Is_Hide invalid(number)", func(t *testing.T) {
	// 	fTest := friend
	// 	var testBoolean = 1
	// 	fTest.Is_Hide = &testBoolean

	// 	ok, err := govalidator.ValidateStruct(fTest)

	// 	g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

	// 	g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

	// 	g.Expect(err.Error()).To(gomega.Equal("การซ่อนผิดพลาด")) // check error message
	// })

	t.Run("date invalid(in past (>10 min))", func(t *testing.T) {
		fTest := friend
		fTest.Date = time.Now().Add(time.Second * -600) //.AddDate(0, 0, -1)

		ok, err := govalidator.ValidateStruct(fTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("เวลาเป็นอดีต ลองโหลดหน้าเว็บอีกรอบ")) // check error message
	})
}
