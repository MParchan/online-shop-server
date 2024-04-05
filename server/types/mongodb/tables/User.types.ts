import { Document, Types } from "mongoose";

export interface UserType extends Document {
    email: string;
    password: string;
    phoneNumber: string;
    firstName?: string;
    lastName?: string;
    role: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}
