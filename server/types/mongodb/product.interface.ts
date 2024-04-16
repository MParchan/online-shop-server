import { Types } from "mongoose";

export interface IProduct {
    name: string;
    description: string;
    price: number;
    quantity: number;
    subcategory: Types.ObjectId;
    brand: Types.ObjectId;
}
