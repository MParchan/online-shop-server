import { Schema, model } from "mongoose";
import { IImage } from "../types/mongodb/image.interface";

const ImageModel = model(
    "Image",
    new Schema<IImage>(
        {
            image: {
                type: Buffer,
                required: [true, "Image is required"]
            },

            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Image product is required"]
            }
        },
        {
            timestamps: true
        }
    )
);

export default ImageModel;
