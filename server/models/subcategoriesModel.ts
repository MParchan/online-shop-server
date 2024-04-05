import { Schema, model } from "mongoose";

const subcategorySchema = new Schema(
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

const Subcategory = model("Subcategory", subcategorySchema);
export default Subcategory;
