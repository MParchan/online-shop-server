import { Document, Types } from "mongoose";

export interface IPropertyType extends Document {
    name: string;
    type: string;
    subcategory: Types.ObjectId;
    properties: Types.ObjectId[];
}
