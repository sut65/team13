package unit_test

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
	"github.com/sut65/team13/entity"
)

func TestGameValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	game := entity.Game{ // set up data for test
		Game_Name:        "Suki Suki da!",
		Game_Price:       2000,
		Game_description: "Sasuke Sasuke Sasuke Sasuke Sasuke Sasuke Sasuke",
		Game_file:        "https://www.youtube.com/watch?v=XOSAGJW3C9Q&list=RDXOSAGJW3C9Q&start_radio=1",
		Publish_Date:     time.Now().Add(time.Second * -599),
		Game_Picture:     "data:image/jpeg;base64,/9jdasddsawegdasd/asdger",
	}

	t.Run("the data is correct", func(t *testing.T) {
		gameTest := game

		ok, err := govalidator.ValidateStruct(gameTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})

	t.Run("game_name cant be null", func(t *testing.T) {
		gameTest := game
		gameTest.Game_Name = ""

		ok, err := govalidator.ValidateStruct(gameTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Please Enter your Game Name")) // check error message
	})

	t.Run("game_name must be in 30 character", func(t *testing.T) {
		gameTest := game
		gameTest.Game_Name = "1234567890123456789012345678901"

		ok, err := govalidator.ValidateStruct(gameTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Name must not more than 30 character")) // check error message
	})

	t.Run("game_price must in range (0,100000)", func(t *testing.T) {
		gameTest := game
		gameTest.Game_Price = 100001

		ok, err := govalidator.ValidateStruct(gameTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Price incorrect")) // check error message
	})
	t.Run("game_description cant be null", func(t *testing.T) {
		gameTest := game
		gameTest.Game_description = ""

		ok, err := govalidator.ValidateStruct(gameTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Please Enter your Game Description")) // check error message
	})

	t.Run("game_description must be less than 200 character", func(t *testing.T) {
		gameTest := game
		gameTest.Game_description = "1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890"

		ok, err := govalidator.ValidateStruct(gameTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Description must be less than 200 character")) // check error message
	})

	t.Run("game_picture incorrect", func(t *testing.T) {
		gameTest := game
		gameTest.Game_Picture = "FFXV"

		ok, err := govalidator.ValidateStruct(gameTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Game Image incorrect")) // check error message
	})
	t.Run("game image cant be null", func(t *testing.T) {
		gameTest := game
		gameTest.Game_Picture = ""

		ok, err := govalidator.ValidateStruct(gameTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Please upload image")) // check error message
	})

}
