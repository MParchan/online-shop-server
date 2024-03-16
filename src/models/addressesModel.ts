import { Schema, model } from "mongoose";

const addressSchema = new Schema(
    {
        name: {
            type: String,
            require: [true, "Address name is required"],
        },

        country: {
            type: String,
            require: [true, "Address country is required"],
        },

        city: {
            type: String,
            require: [true, "Address city is required"],
        },

        zipcode: {
            type: String,
            require: [true, "Address zipcode is required"],
        },

        street: {
            type: String,
            require: [true, "Address street is required"],
        },

    },
    {
        timestamps: true,
    }
);

const Address = model("Address", addressSchema);
export default Address;