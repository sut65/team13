package unit_test

import (
	"testing"

	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
	"github.com/sut65/team13/entity"
)

func TestVideoValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	t.Run("the data is correct", func(t *testing.T) {
		user := entity.User{
			Password:            "$2a$12$hRdKLZTUspkskzjZwBAb6eImCpHYIe48KSUGD83JrzHYx6aKfowb6",
			Profile_Name:        "Udong",
			Profile_Description: "eiei",
			Profile_Picture:     "data:image/jpeg;base64,/9j/4AAQ/AndSoOn", // ปกติจะยาวกว่านี้แต่อันนี้เอามาเทสสั้นๆ
			Store_Description:   "eiei",
			Store_Contact:       "natt@gmail.com",
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})
}
