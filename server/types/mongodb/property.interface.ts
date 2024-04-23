import { Document, Types } from "mongoose";

export interface IProperty extends Document {
    value: string;
    product: Types.ObjectId;
    propertyType: Types.ObjectId;
}
