import { Types } from "mongoose";

export interface IProperty {
    value: string;
    product: Types.ObjectId;
    propertyType: Types.ObjectId;
}
