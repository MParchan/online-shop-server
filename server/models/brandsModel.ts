import { Schema, model } from "mongoose";
import { IBrand } from "../types/mongodb/brand.interface";

const BrandModel = model(
    "Brand",
    new Schema<IBrand>(
        {
            name: {
                type: String,
                required: [true, "Brand name is required"]
            }
        },
        {
            timestamps: true
        }
    )
);

export default BrandModel;
