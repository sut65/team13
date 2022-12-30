import { UsersInterface } from "../user/IUser";
import { Game_StatusInterface } from "./IGame_Status";
import { Type_GamesInterface } from "./IType_Game";
import { RatingsInterface } from "./IRating";

export interface GamesInterface {
    ID: number,
    Game_Name: string,
	Publish_Date: Date | null,
	Seller_ID: number,
	Seller: UsersInterface,
	Game_Status_ID: number,
	Game_Status: Game_StatusInterface,
	Type_Game_ID: number,
	Type_Game: Type_GamesInterface,
	Rating_ID: number,
	Rating: RatingsInterface,
}