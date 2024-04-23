import { Document, Types } from "mongoose";

export interface IProductProperty extends Document {
    product: Types.ObjectId;
    property: Types.ObjectId;
}
