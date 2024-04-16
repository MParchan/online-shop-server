import { Types } from "mongoose";

export interface IAddress {
    name: string;
    country: string;
    city: string;
    zipcode: string;
    street: string;
    user: Types.ObjectId;
}
