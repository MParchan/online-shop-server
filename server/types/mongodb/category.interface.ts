import { Types } from "mongoose";

export interface ICategory {
    name: string;
    subcategories: Types.ObjectId[];
}
