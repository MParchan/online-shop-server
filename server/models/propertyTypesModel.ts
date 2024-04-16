import { Schema, model } from "mongoose";
import { IPropertyType } from "../types/mongodb/propertyType.interface";

const PropertyTypeModel = model(
    "PropertyType",
    new Schema<IPropertyType>(
        {
            name: {
                type: String,
                required: [true, "PropertyType name is required"]
            },

            subcategory: {
                type: Schema.Types.ObjectId,
                ref: "Subcategory",
                required: [true, "Property type subcategory is required"]
            }
        },
        {
            timestamps: true
        }
    )
);

export default PropertyTypeModel;
