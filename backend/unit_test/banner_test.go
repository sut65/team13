package unit_test

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
	"github.com/sut65/team13/entity"
)

func TestBannerValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	banner := entity.Banner{ // set up data for test
		Banner_Picture: "data:image/jpeg;base64,/9j/4AAQ/AndSoOn", // ปกติจะยาวกว่านี้แต่อันนี้เอามาเทสสั้นๆ
		Description:    "Cantact at : 091-542-9136",
		Edit_at:        time.Now(),
	}

	t.Run("the data is correct", func(t *testing.T) {
		bTest := banner

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})

	t.Run("image format invalid", func(t *testing.T) {
		bTest := banner
		bTest.Banner_Picture = "data:text/plain;base64,/9j/4AAQ/AndSoOn"

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("รูปภาพไม่ถูกต้อง")) // check error message
	})

	t.Run("image can not blank", func(t *testing.T) {
		bTest := banner
		bTest.Banner_Picture = ""

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("กรุณาอัปโหลดรูปภาพ")) // check error message
	})

	t.Run("description max length is 50", func(t *testing.T) {
		bTest := banner
		bTest.Description = "1234567890 1234567890 1234567890 1234567890 1234567890" // 54 ตัวอักษร

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Banner Description ความยาวไม่เกิน 50 ตัวอักษร")) // check error message
	})

	t.Run("time can not be past", func(t *testing.T) {
		bTest := banner
		bTest.Edit_at = time.Now().Add(time.Minute * -11)

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("เวลาห้ามเป็นอดีต")) // check error message
	})
}
