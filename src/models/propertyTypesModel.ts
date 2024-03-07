import { Schema, model } from "mongoose";

const propertyTypeSchema = new Schema(
    {
        name: {
            type: String,
            require: [true, "PropertyType name is required"],
        },

        subcategory: [{
            type: Schema.Types.ObjectId,
            ref: "Subcategory",
            require: [true, "Property type subcategory is required"],
        }]
    },
    {
        timestamps: true,
    }
);

const PropertyType = model("PropertyType", propertyTypeSchema);
export default PropertyType;