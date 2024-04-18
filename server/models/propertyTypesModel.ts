import { Model, Schema, model } from "mongoose";
import { IPropertyType } from "../types/mongodb/propertyType.interface";

const propertyTypeSchema = new Schema<IPropertyType>(
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
);

const PropertyType: Model<IPropertyType> = model<IPropertyType>("PropertyType", propertyTypeSchema);
export default PropertyType;
