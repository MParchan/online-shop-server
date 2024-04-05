import { Schema, model } from "mongoose";

const addressSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Address name is required"]
        },

        country: {
            type: String,
            required: [true, "Address country is required"]
        },

        city: {
            type: String,
            required: [true, "Address city is required"]
        },

        zipcode: {
            type: String,
            required: [true, "Address zipcode is required"]
        },

        street: {
            type: String,
            required: [true, "Address street is required"]
        }
    },
    {
        timestamps: true
    }
);

const Address = model("Address", addressSchema);
export default Address;
