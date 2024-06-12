import { Model, Schema, model } from "mongoose";
import { IProductProperty } from "../types/mongodb/productProperty.interface";
import Property from "./propertiesModel";

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

productPropertySchema.pre("findOneAndDelete", async function (next) {
    try {
        const productProperty = this.getQuery();
        const property = await Property.findById(productProperty.property);
        if (property) {
            property.productProperties = property.productProperties.filter((id) => !id.equals(productProperty._id));
            if (!property.productProperties.length) {
                await property.deleteOne();
            } else {
                await property.save();
            }
        }
    } catch (err) {
        const error = err as Error;
        next(error);
    }
    next();
});

productPropertySchema.pre("deleteMany", async function (next) {
    try {
        const productProperties = await this.model.find(this.getFilter());
        await Promise.all(
            productProperties.map(async (productProperty) => {
                const property = await Property.findById(productProperty.property);
                if (property) {
                    property.productProperties = property.productProperties.filter(
                        (id) => !id.equals(productProperty._id)
                    );
                    if (!property.productProperties.length) {
                        await property.deleteOne();
                    } else {
                        await property.save();
                    }
                }
            })
        );
    } catch (err) {
        const error = err as Error;
        next(error);
    }
    next();
});

const ProductProperty: Model<IProductProperty> = model<IProductProperty>("ProductProperty", productPropertySchema);
export default ProductProperty;
