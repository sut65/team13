import {UsersInterface} from "../user/IUser"
import {BasketInterface} from "../basket/IBasket"
import {OptionsInterface} from "./IOption"
import {FriendsInterface} from "../friend/IFriend"

export interface OrderInterface {
    ID: number,
    User_ID: number,
    User: UsersInterface,
    Basket_ID: number,
    Basket: BasketInterface,
    Option_ID: number,
    Option: OptionsInterface,
    Slip: string,
    Date: Date,
    Send_gift: boolean,
    Friend_ID: number,
    Friend: FriendsInterface,
}
