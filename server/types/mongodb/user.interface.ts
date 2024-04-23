import { Document, Types } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    phoneNumber: string;
    firstName?: string;
    lastName?: string;
    role: Types.ObjectId;
    addresses: Types.ObjectId[];
    opinions: Types.ObjectId[];
    orders: Types.ObjectId[];
}
