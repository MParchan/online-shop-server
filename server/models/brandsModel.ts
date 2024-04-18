import { Model, Schema, model } from "mongoose";
import { IBrand } from "../types/mongodb/brand.interface";

const brandSchema = new Schema<IBrand>(
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

const Brand: Model<IBrand> = model<IBrand>("Brand", brandSchema);
export default Brand;
