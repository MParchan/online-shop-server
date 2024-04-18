import { Model, Schema, model } from "mongoose";
import { ISubcategory } from "../types/mongodb/subcategory.interface";

const subcategorySchema = new Schema<ISubcategory>(
    {
        name: {
            type: String,
            required: [true, "Subcategory name is required"]
        },

        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Subcategory category is required"]
        }
    },
    {
        timestamps: true
    }
);

const Subcategory: Model<ISubcategory> = model<ISubcategory>("Subcategory", subcategorySchema);
export default Subcategory;
