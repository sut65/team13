package unit_test

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
	"github.com/sut65/team13/entity"
)

func TestTopgameValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	topgame := entity.Topgame{ // set up data for test
		Comment: "This is a GAME. This is NOT a training tool. This GAME will not teach you how to build a real computer in real life. For entertainment value this GAME is fun and entertaining. If you like building, overclocking, and custom water cooling computers then you will love this GAME.",
		Date:    time.Now(),
	}

	t.Run("the data is correct", func(t *testing.T) {
		bTest := topgame

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})

	t.Run("Comment can not blank", func(t *testing.T) {
		bTest := topgame
		bTest.Comment = ""

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Commentห้ามว่าง")) // check error message
	})

	t.Run("comment max length is 300", func(t *testing.T) {
		bTest := topgame
		bTest.Comment = "This is a GAME. This is NOT a training tool. This GAME will not teach you how to build a real computer in real life. For entertainment value this GAME is fun and entertaining. If you like building, overclocking, and custom water cooling computers then you will love this GAME. If you have never seen inside of a computer before and think you will learn how to build a real computer by playing this GAME then this GAME is not for you and you should not buy it." // 460 ตัวอักษร

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("แสดงความคิดเห็นความยาวไม่เกิน 300 ตัวอักษร")) // check error message
	})

	t.Run("time can not be past", func(t *testing.T) {
		bTest := topgame
		bTest.Date = time.Now().Add(time.Minute * -11)

		ok, err := govalidator.ValidateStruct(bTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("เวลาเป็นอดีต ลองโหลดหน้าเว็บอีกรอบ")) // check error message
	})
}
