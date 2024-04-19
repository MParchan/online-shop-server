import { Model, Schema, model } from "mongoose";
import { IProductProperty } from "../types/mongodb/productProperty.interface";

const productPropertySchema = new Schema<IProductProperty>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "ProductProperty product is required"]
        },

        property: {
            type: Schema.Types.ObjectId,
            ref: "Property",
            required: [true, "ProductProperty property is required"]
        }
    },
    {
        timestamps: true
    }
);

const ProductProperty: Model<IProductProperty> = model<IProductProperty>("ProductProperty", productPropertySchema);
export default ProductProperty;
