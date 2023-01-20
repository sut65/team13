import { StarInterface } from "./IStar";
import { UsersInterface } from "../user/IUser";
import { GamesInterface } from "../game/IGame";

export interface ReviewInterface {
    ID: number,
    Comment: string,
    Date: Date,
    Game_ID: number,
    Game: GamesInterface,
    User_ID: number,
    User: UsersInterface,
    Star_ID: number,
    Star: StarInterface,
}