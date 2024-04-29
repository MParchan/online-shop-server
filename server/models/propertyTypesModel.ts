import { Model, Schema, model } from "mongoose";
import { IPropertyType } from "../types/mongodb/propertyType.interface";
import Property from "./propertiesModel";

const propertyTypeSchema = new Schema<IPropertyType>(
    {
        name: {
            type: String,
            required: [true, "PropertyType name is required"]
        },
        type: {
            type: String,
            enum: ["string", "number", "boolean"],
            default: "string",
            required: [true, "PropertyType type is required"]
        },

        subcategory: {
            type: Schema.Types.ObjectId,
            ref: "Subcategory",
            required: [true, "Property type subcategory is required"]
        },

        properties: [{ type: Schema.Types.ObjectId, ref: "Property" }]
    },
    {
        timestamps: true
    }
);

propertyTypeSchema.pre("findOneAndDelete", async function (next) {
    const propertyTypeId = this.getQuery()["_id"];
    try {
        await Property.deleteMany({ propertyType: propertyTypeId });
    } catch (err) {
        const error = err as Error;
        next(error);
    }
    next();
});

const PropertyType: Model<IPropertyType> = model<IPropertyType>("PropertyType", propertyTypeSchema);
export default PropertyType;
