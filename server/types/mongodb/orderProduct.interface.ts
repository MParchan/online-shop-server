import { Document, Types } from "mongoose";

export interface IOrderProduct extends Document {
    quantity: number;
    order: Types.ObjectId;
    product: Types.ObjectId;
}
