import { Types } from "mongoose";

export interface IImage {
    image: string;
    product: Types.ObjectId;
}
