import { Document, Types } from "mongoose";

export interface IAddress extends Document {
    name: string;
    country: string;
    city: string;
    zipcode: string;
    street: string;
    user: Types.ObjectId;
}
