import { Document, Types } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    quantity: number;
    subcategory: Types.ObjectId;
    brand: Types.ObjectId;
    images: Types.ObjectId[];
    opinions: Types.ObjectId[];
    productProperties: Types.ObjectId[];
}
