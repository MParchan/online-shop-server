import { Schema, model } from "mongoose";

const brandSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Brand name is required"]
        }
    },
    {
        timestamps: true
    }
);

const Brand = model("Brand", brandSchema);
export default Brand;
