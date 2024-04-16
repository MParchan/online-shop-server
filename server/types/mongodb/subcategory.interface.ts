import { Types } from "mongoose";

export interface ISubcategory {
    name: string;
    category: Types.ObjectId;
}
