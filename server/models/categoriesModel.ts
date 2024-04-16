import { Schema, model } from "mongoose";
import { ICategory } from "../types/mongodb/category.interface";

const CategoryModel = model(
    "Category",
    new Schema<ICategory>(
        {
            name: {
                type: String,
                required: [true, "Category name is required"]
            }
        },
        {
            timestamps: true
        }
    )
);

export default CategoryModel;
