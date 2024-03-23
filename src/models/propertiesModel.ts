import { Schema, model } from "mongoose";

const propertySchema = new Schema(
    {
        value: {
            type: String,
            require: [true, "Property value is required"],
        },

        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            require: [true, "Property product is required"],
        },

        propertyType: {
            type: Schema.Types.ObjectId,
            ref: "PropertyType",
            require: [true, "Property property type is required"],
        }
    },
    {
        timestamps: true,
    }
);

const Property = model("Property", propertySchema);
export default Property;