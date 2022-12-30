import { CollectionsInterface } from "./ICollection";
import { UsersInterface } from "../user/IUser";
import { GamesInterface } from "../game/IGame";

export interface StoragesInterface {
    ID: number,
    Game_ID: number,
    Game: GamesInterface,
    User_ID: number,
    User: UsersInterface,
    Collection_ID: number,
    Collection: CollectionsInterface,
}