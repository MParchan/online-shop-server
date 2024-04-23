import { Document, Types } from "mongoose";

export interface ISubcategory extends Document {
    name: string;
    category: Types.ObjectId;
}
