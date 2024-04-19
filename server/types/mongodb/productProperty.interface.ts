import { Types } from "mongoose";

export interface IProductProperty {
    product: Types.ObjectId;
    property: Types.ObjectId;
}
