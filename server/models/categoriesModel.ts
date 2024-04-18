import { Model, Schema, model } from "mongoose";
import { ICategory } from "../types/mongodb/category.interface";
import Subcategory from "./subcategoriesModel";

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, "Category name is required"]
        },
        subcategories: [
            {
                type: Schema.Types.ObjectId,
                ref: "Subcategory"
            }
        ]
    },
    {
        timestamps: true
    }
);

categorySchema.pre("findOneAndDelete", async function (next) {
    const categoryId = this.getQuery()["_id"];
    try {
        await Subcategory.deleteMany({ category: categoryId });
    } catch (err) {
        const error = err as Error;
        next(error);
    }
    next();
});

const Category: Model<ICategory> = model<ICategory>("Category", categorySchema);
export default Category;
