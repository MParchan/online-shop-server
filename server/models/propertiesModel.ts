import { Schema, model } from "mongoose";
import { IProperty } from "../types/mongodb/property.interface";

const PropertyModel = model(
    "Property",
    new Schema<IProperty>(
        {
            value: {
                type: String,
                required: [true, "Property value is required"]
            },

            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Property product is required"]
            },

            propertyType: {
                type: Schema.Types.ObjectId,
                ref: "PropertyType",
                required: [true, "Property property type is required"]
            }
        },
        {
            timestamps: true
        }
    )
);

export default PropertyModel;
