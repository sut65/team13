package unit_test

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
	"github.com/sut65/team13/entity"
)

func TestReviewValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	review := entity.Review{ // set up data for test
		Comment: "This is a GAME. This is NOT a training tool. This GAME will not teach you how to build a real computer in real life. For entertainment value this GAME is fun and entertaining. If you like building, overclocking, and custom water cooling computers then you will love this GAME.",
		Date:    time.Now(),
	}

	t.Run("the data is correct", func(t *testing.T) {
		bTest := review

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})

	t.Run("Comment can not blank", func(t *testing.T) {
		bTest := review
		bTest.Comment = ""

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("กรุณาเขียนคอนเมนต์")) // check error message
	})

	t.Run("comment max length is 400", func(t *testing.T) {
		bTest := review
		bTest.Comment = "I was afraid to touch my computer, at all. My friend built it for me. The cables were a mess, my GPU wasn't screwed in properly, and the thermal paste wasn't switched in almost 2 years. I played this game for a few hours, and my actual computer was in the game! It took away a lot of the fear I had of messing something up, and I was able to take apart my computer, and clean/fix everything and put it back together. I wouldn't have done that if it wasn't for this game really showing me how easy it actually is." // 513 ตัวอักษร

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("แสดงความคิดเห็นความยาวไม่เกิน 400 ตัวอักษร")) // check error message
	})

	t.Run("time can not be past", func(t *testing.T) {
		bTest := review
		bTest.Date = time.Now().Add(time.Minute * -11)

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("เวลาเป็นอดีต ลองโหลดหน้าเว็บอีกรอบ")) // check error message
	})
}
