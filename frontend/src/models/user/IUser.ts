import { GendersInterface } from "./IGender"
import { StoragesInterface } from "../storage/IStorage"
import { GamesInterface } from "../game/IGame"

export interface UsersInterface { // Maybe BUG warning คือตัวเชื่อม interface วนไปมา
    ID: number,
    Email: string,
	Password: string,
	Profile_Name: string,
	Profile_Description: string,
	Profile_Picture: string, // JavaScript Int8Array = byte ; แต่ต้องลองใช้ดูว่า work ไหมกับ go []byte
	Gender_ID: number,
	Gender: GendersInterface,
	Favorite_Game_ID: number,
	Favorite_Game: StoragesInterface,
	Is_Seller: boolean,
	Store_Description: string,
	Out_Standing_Game_ID: number,
	Out_Standing_Game: GamesInterface,
	Store_Contact: string,
}