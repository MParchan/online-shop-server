import { Model, Schema, model } from "mongoose";
import { IAddress } from "../types/mongodb/address.interface";

const addressSchema = new Schema<IAddress>(
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
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Order user is required"]
        }
    },
    {
        timestamps: true
    }
);

const Address: Model<IAddress> = model<IAddress>("Address", addressSchema);
export default Address;
