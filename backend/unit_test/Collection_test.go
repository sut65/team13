package unit_test

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
	"github.com/sut65/team13/entity"
)

func TestCollectionValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	collection := entity.Collection{
		Name: "fav",
		Note: "Favorite",
		Date: time.Now().Add(time.Second * -599),
	}

	t.Run("the data is correct", func(t *testing.T) {
		colTest := collection

		ok, err := govalidator.ValidateStruct(colTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		// g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})

	t.Run("Name invalid(null)", func(t *testing.T) {
		colTest := collection
		colTest.Name = ""

		ok, err := govalidator.ValidateStruct(colTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("คุณไม่ได้ใส่ชื่อ")) // check error message
	})

	t.Run("Name invalid(>50)", func(t *testing.T) {
		colTest := collection
		colTest.Name = "666546465464564565464565464564564564564564564564564564564564564545645645645645645"

		ok, err := govalidator.ValidateStruct(colTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("ชื่อความยาวไม่เกิน 50 ตัวอักษร")) // check error message
	})

	t.Run("date invalid(in past (>10 min))", func(t *testing.T) {
		colTest := collection
		colTest.Date = time.Now().Add(time.Second * -600) //.AddDate(0, 0, -1)

		ok, err := govalidator.ValidateStruct(colTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("เวลาเป็นอดีต รีเฟชหน้าเว็บใหม่")) // check error message
	})
}
