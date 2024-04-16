import { Types } from "mongoose";

export interface IOpinion {
    date: Date;
    rating: number;
    description?: string;
    user: Types.ObjectId;
    product: Types.ObjectId;
}
