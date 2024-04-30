import { Model, Schema, model } from "mongoose";
import { IProperty } from "../types/mongodb/property.interface";
import ProductProperty from "./productPropertiesModel";

const propertySchema = new Schema<IProperty>(
    {
        value: {
            type: String,
            required: [true, "Property value is required"]
        },

        propertyType: {
            type: Schema.Types.ObjectId,
            ref: "PropertyType",
            required: [true, "Property property type is required"]
        },

        productProperties: [{ type: Schema.Types.ObjectId, ref: "ProductProperty" }]
    },
    {
        timestamps: true
    }
);

propertySchema.pre("findOneAndDelete", async function (next) {
    const propertyId = this.getQuery()["_id"];
    try {
        await ProductProperty.deleteMany({ property: propertyId });
    } catch (err) {
        const error = err as Error;
        next(error);
    }
    next();
});

propertySchema.pre("deleteMany", async function (next) {
    try {
        const properties = await this.model.find(this.getFilter());
        const propertyIds = properties.map((property) => property._id);
        await ProductProperty.deleteMany({ property: { $in: propertyIds } });
    } catch (err) {
        const error = err as Error;
        next(error);
    }
    next();
});

const Property: Model<IProperty> = model<IProperty>("Property", propertySchema);
export default Property;
