import { Document, Types } from "mongoose";

export interface IImage extends Document {
    image: string;
    product: Types.ObjectId;
}
