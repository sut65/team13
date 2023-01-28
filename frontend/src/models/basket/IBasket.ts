import { UsersInterface } from "../user/IUser";
import { GamesInterface } from "../game/IGame";
import { Payment_StatusInterface } from "./IPayment_Status";
import { OrderInterface } from "../order/IOrder";

export interface BasketInterface {
    ID: number,
    User_ID: number,
    User: UsersInterface,
    Game_ID: number,
    Game: GamesInterface,
    Payment_Status_ID: number,
    Payment_Status: Payment_StatusInterface,
    Note: string,
    Date: Date,
    Order_ID: number,
    Order: OrderInterface,
}