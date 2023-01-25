
import { UsersInterface } from "../user/IUser";
import { GamesInterface } from "../game/IGame";
import { Wish_levelInterface } from "./IWish_Level";
export interface WishlistInterface {
    ID: number,
    Date: Date,
    Note: string,
    Game_ID: number,
    Game: GamesInterface,
    User_ID: number,
    User: UsersInterface,
    Level_ID:number,
    Wish_Level: Wish_levelInterface,

}