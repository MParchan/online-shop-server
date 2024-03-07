import { Schema, model } from "mongoose";

const addressSchema = new Schema(
    {
        name: {
            type: String,
        },

        country: {
            type: String,
        },

        city: {
            type: String,
        },

        zipcode: {
            type: String,
        },

        street: {
            type: String,
        },

    },
    {
        timestamps: true,
    }
);

const Address = model("Address", addressSchema);
export default Address;