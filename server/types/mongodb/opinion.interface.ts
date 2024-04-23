import { Document, Types } from "mongoose";

export interface IOpinion extends Document {
    date: Date;
    rating: number;
    description?: string;
    user: Types.ObjectId;
    product: Types.ObjectId;
}
