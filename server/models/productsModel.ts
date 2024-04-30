import { Model, Schema, model } from "mongoose";
import { IProduct } from "../types/mongodb/product.interface";
import Image from "./imagesModel";
import Opinion from "./opinionsModel";
import ProductProperty from "./productPropertiesModel";

const productSchema = new Schema<IProduct>(
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
        },

        images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
        opinions: [{ type: Schema.Types.ObjectId, ref: "Opinion" }],
        productProperties: [{ type: Schema.Types.ObjectId, ref: "ProductProperty" }]
    },
    {
        timestamps: true
    }
);

productSchema.pre("findOneAndDelete", async function (next) {
    const productId = this.getQuery()["_id"];
    try {
        await Promise.all([
            Image.deleteMany({ product: productId }),
            Opinion.deleteMany({ product: productId }),
            ProductProperty.deleteMany({ product: productId })
        ]);
    } catch (err) {
        const error = err as Error;
        next(error);
    }
    next();
});

productSchema.pre("deleteMany", async function (next) {
    try {
        const products = await this.model.find(this.getFilter());
        const productIds = products.map((product) => product._id);
        await Promise.all([
            Image.deleteMany({ product: { $in: productIds } }),
            Opinion.deleteMany({ product: { $in: productIds } }),
            ProductProperty.deleteMany({ product: { $in: productIds } })
        ]);
    } catch (err) {
        const error = err as Error;
        next(error);
    }
    next();
});

const Product: Model<IProduct> = model<IProduct>("Product", productSchema);
export default Product;
