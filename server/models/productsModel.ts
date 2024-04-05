import { Schema, model } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"]
        },

        description: {
            type: String,
            required: [true, "Product description is required"]
        },

        price: {
            type: Number,
            validate: {
                validator: function (value: number) {
                    return value > 0 && /^(\d{1,})(\.\d{1,2})?$/.test(value.toString());
                },
                message: "{VALUE} is not a positive number with 2 decimal places"
            },
            required: [true, "Product price is required"]
        },

        quantity: {
            type: Number,
            validate: {
                validator: function (value: number) {
                    return Number.isInteger(value) && value > 0;
                },
                message: "{VALUE} is not a positive integer"
            },
            required: [true, "Product quantity is required"]
        },

        subcategory: {
            type: Schema.Types.ObjectId,
            ref: "Subcategory",
            required: [true, "Product subcategory is required"]
        },

        brand: {
            type: Schema.Types.ObjectId,
            ref: "Brand",
            required: [true, "Product brand is required"]
        }
    },
    {
        timestamps: true
    }
);

const Product = model("Product", productSchema);
export default Product;
