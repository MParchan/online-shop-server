import { Types } from "mongoose";

export interface IImage {
    image: Buffer;
    product: Types.ObjectId;
}
