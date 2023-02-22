import {UsersInterface} from "../user/IUser"
import {BasketInterface} from "../basket/IBasket"
import {FriendsInterface} from "../friend/IFriend"
import { VerificationStatusInterface } from "../payment_verification/IVerificationStatus"

export interface OrderInterface {
    ID: number,
    User_ID: number,
    User: UsersInterface,
    Basket_ID: number,
    Basket: BasketInterface,
    Verification_Status_ID: number,
    Verification_Status: VerificationStatusInterface,
    Slip: string,
    Date: Date,
    Send_gift: boolean,
    Friend_ID: number,
    Friend: FriendsInterface,
}
