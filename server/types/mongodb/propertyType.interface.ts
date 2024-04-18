import { Types } from "mongoose";

export interface IPropertyType {
    name: string;
    type: string;
    subcategory: Types.ObjectId;
}
