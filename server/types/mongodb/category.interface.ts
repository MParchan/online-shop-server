import { Document, Types } from "mongoose";
import { ISubcategory } from "./subcategory.interface";

export interface ICategory extends Document {
    name: string;
    subcategories: Types.ObjectId[] | ISubcategory[];
}
