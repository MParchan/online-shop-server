import { Document, Types } from "mongoose";

export interface IImage extends Document {
    image: string;
    main: boolean;
    product: Types.ObjectId;
}
