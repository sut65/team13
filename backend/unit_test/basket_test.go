package unit_test

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
	"github.com/sut65/team13/entity"
)

func TestBasketValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	basket := entity.Basket{
		Note: "อยากได้มานานแล้ว",
		Date: time.Now().Add(time.Second * -599),
	}

	t.Run("the data is correct", func(t *testing.T) {
		bTest := basket

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})

	t.Run("note invalid(null)", func(t *testing.T) {
		bTest := basket
		bTest.Note = ""

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("คุณไม่ได้ใส่โน๊ต")) // check error message
	})

	t.Run("note invalid(>200)", func(t *testing.T) {
		bTest := basket
		bTest.Note = "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("โน็ตความยาวไม่เกิน 200 ตัวอักษร")) // check error message
	})

	t.Run("note invalid(>200)", func(t *testing.T) {
		bTest := basket
		bTest.Date = time.Now().Add(time.Second * -600) //.AddDate(0, 0, -1)

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("เวลาไม่ถูกต้อง")) // check error message
	})
}
