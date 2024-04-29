import { Document, Types } from "mongoose";

export interface IProperty extends Document {
    value: string;
    propertyType: Types.ObjectId;
    productProperties: Types.ObjectId[];
}
