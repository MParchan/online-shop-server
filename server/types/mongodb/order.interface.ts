import { Document, Types } from "mongoose";

export interface IOrder extends Document {
    date: Date;
    status: string;
    paymentMethod: string;
    country: string;
    city: string;
    zipcode: string;
    street: string;
    user: Types.ObjectId;
    orderProducts: Types.ObjectId[];
}
