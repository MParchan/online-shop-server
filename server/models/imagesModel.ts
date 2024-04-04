import { Schema, model } from "mongoose";

const imageSchema = new Schema(
    {
        image: {
            type: Buffer,
            require: [true, "Image is required"],
        },

        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            require: [true, "Image product is required"],
        },
    },
    {
        timestamps: true,
    }
);

const Image = model("Image", imageSchema);
export default Image;