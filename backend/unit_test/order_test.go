package unit_test

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
	"github.com/sut65/team13/entity"
)

func TestOrderValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	order := entity.Order{
		Slip: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/",
		Date: time.Now().Add(time.Second * -599),
	}

	t.Run("the data is correct", func(t *testing.T) {
		odTest := order

		ok, err := govalidator.ValidateStruct(odTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message

	})

	t.Run("Slip is null", func(t *testing.T) {
		odTest := order
		odTest.Slip = ""

		ok, err := govalidator.ValidateStruct(odTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("กรุณาอัปโหลดรูปภาพ"))
	})

	t.Run("date invalid(>10 min)", func(t *testing.T) {
		odTest := order
		odTest.Date = time.Now().Add(time.Second * -600) //.AddDate(0, 0, -1)

		ok, err := govalidator.ValidateStruct(odTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("เวลาเป็นอดีต กรุณาโหลดหน้าเว็บใหม่")) // check error message
	})
}
