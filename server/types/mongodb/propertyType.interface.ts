import { Types } from "mongoose";

export interface IPropertyType {
    name: string;
    subcategory: Types.ObjectId;
}
