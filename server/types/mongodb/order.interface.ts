import { Document, Types } from "mongoose";

export interface IOrder extends Document {
    date: Date;
    status: string;
    paymentMethod: string;
    customerName: string;
    email: string;
    phoneNumber: string;
    country: string;
    city: string;
    zipcode: string;
    street: string;
    user: Types.ObjectId;
    value: number;
    orderProducts: Types.ObjectId[];
}
