import { UsersInterface } from "../user/IUser";
import { GamesInterface } from "../game/IGame";
import { AdminsInterface } from "../admin/IAdmin";

export interface BannersInterface {
    ID:             number,
    Banner_Picture: string,
	Description:    string,
	Edit_at:        Date,
	User_ID:        number,
	User:           UsersInterface,
	Admin_ID:       number,
	Admin:          AdminsInterface,
	Game_ID:        number,
	Game:           GamesInterface,
}