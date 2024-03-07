import { Schema, model } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            require: [true, "Product name is required"],
        },

        description: {
            type: String,
            require: [true, "Product description is required"],
        },

        price: {
            type: Number,
            validate: {
                validator: function (value: number) {
                    return value > 0 && /^(\d{1,})(\.\d{1,2})?$/.test(value.toString());
                },
                message: "{VALUE} is not a positive number with 2 decimal places"
            },
            require: [true, "Product price is required"],
        },

        quantity: {
            type: Number,
            validate: {
                validator: function (value: number) {
                    return Number.isInteger(value) && value > 0;
                },
                message: "{VALUE} is not a positive integer"
            },
            require: [true, "Product quantity is required"],
        },

        subcategory: [{
            type: Schema.Types.ObjectId,
            ref: "Subcategory",
            require: [true, "Product subcategory is required"],
        }],

        brand: [{
            type: Schema.Types.ObjectId,
            ref: "Brand",
            require: [true, "Product brand is required"],
        }]
    },
    {
        timestamps: true,
    }
);

const Product = model("Product", productSchema);
export default Product;