import { Types } from "mongoose";

export interface IOrder {
    date: Date;
    status: string;
    paymentMethod: string;
    country: string;
    city: string;
    zipcode: string;
    street: string;
    user: Types.ObjectId;
}
