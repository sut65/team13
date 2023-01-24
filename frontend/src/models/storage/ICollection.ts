import { UsersInterface } from "../user/IUser";
export interface CollectionsInterface {
    ID: number,
    Name: string;
    User_ID: number,
    User: UsersInterface,
}