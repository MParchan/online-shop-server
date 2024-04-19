import { Model, Schema, model } from "mongoose";
import { IProperty } from "../types/mongodb/property.interface";

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
        }
    },
    {
        timestamps: true
    }
);

const Property: Model<IProperty> = model<IProperty>("Property", propertySchema);
export default Property;
