import { Schema, model } from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type: String,
            require: [true, "Category name is required"],
        }
    },
    {
        timestamps: true,
    }
);

const Category = model("Category", categorySchema);
export default Category;