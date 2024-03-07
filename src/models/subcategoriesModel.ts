import { Schema, model } from "mongoose";

const subcategorySchema = new Schema(
    {
        name: {
            type: String,
            require: [true, "Subcategory name is required"],
        },

        category: [{
            type: Schema.Types.ObjectId,
            ref: "Category",
            require: [true, "Subcategory category is required"],
        }]
    },
    {
        timestamps: true,
    }
);

const Subcategory = model("Subcategory", subcategorySchema);
export default Subcategory;