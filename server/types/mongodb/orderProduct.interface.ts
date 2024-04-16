import { Types } from "mongoose";

export interface IOrderProduct {
    quantity: number;
    order: Types.ObjectId;
    product: Types.ObjectId;
}
