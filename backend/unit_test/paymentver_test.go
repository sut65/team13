package unit_test

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
	"github.com/sut65/team13/entity"
)

func TestPaymentVerValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	paymentver := entity.Payment_Verification{
		Note: "test test",
		Date: time.Now().Add(time.Second * -599),
	}

	t.Run("the data is correct", func(t *testing.T) {
		pvTest := paymentver

		ok, err := govalidator.ValidateStruct(pvTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message

	})

	t.Run("Note is null", func(t *testing.T) {
		pvTest := paymentver
		pvTest.Note = ""

		ok, err := govalidator.ValidateStruct(pvTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Note cannot be blank"))
	})

	t.Run("Note length > 50", func(t *testing.T) {
		pvTest := paymentver
		pvTest.Note = "1234567890 1234567890 1234567890 1234567890 1234567890"

		ok, err := govalidator.ValidateStruct(pvTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Note ความยาวไม่เกิน 50 ตัวอักษร"))
	})

	t.Run("date invalid(>10 min)", func(t *testing.T) {
		pvTest := paymentver
		pvTest.Date = time.Now().Add(time.Second * -600) //.AddDate(0, 0, -1)

		ok, err := govalidator.ValidateStruct(pvTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("เวลาเป็นอดีต กรุณาโหลดหน้าเว็บใหม่")) // check error message
	})
}
