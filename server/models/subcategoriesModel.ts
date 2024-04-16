import { Schema, model } from "mongoose";
import { ISubcategory } from "../types/mongodb/subcategory.interface";

const SubcategoryModel = model(
    "Subcategory",
    new Schema<ISubcategory>(
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
    )
);

export default SubcategoryModel;
