import { Types } from "mongoose";

export interface IUser {
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
