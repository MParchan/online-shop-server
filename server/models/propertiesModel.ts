import { Schema, model } from "mongoose";

const propertySchema = new Schema(
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
);

const Property = model("Property", propertySchema);
export default Property;
