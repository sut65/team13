import { UsersInterface } from "../user/IUser";
import { GamesInterface } from "../game/IGame";
import { IntimateInterface } from "./IIntimate";

export interface FriendInterface {
    ID:             number,
    User_ID:        number,
	User:           UsersInterface,
	User_Friend_ID: number,
	User_Friend:    UsersInterface,
	Intimate_ID:    number,
	Intimate:       IntimateInterface,
	Nickname:       string,
	Game_ID:        number,
	Game:           GamesInterface
	Is_Hide:        boolean,
	Date:           Date,
}