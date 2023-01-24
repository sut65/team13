import { AdminsInterface } from "../admin/IAdmin";
import { OrderInterface } from "../order/IOrder";
import { VerificationStatusInterface } from "./IVerificationStatus";


export interface PaymentVerificationInterface {
    ID: number,
    Admin_ID: number,
    Admin: AdminsInterface,
    Order_ID: number,
    Order: OrderInterface,
    VS_ID: number,
    VerificationStatus: VerificationStatusInterface,
    Date: Date,
    Note: string,
}