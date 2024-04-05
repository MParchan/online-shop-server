import { Schema, model } from "mongoose";

const orderSchema = new Schema(
    {
        date: {
            type: Date,
            required: [true, "Order date is required"]
        },

        status: {
            type: String,
            required: [true, "Order status is required"]
        },

        paymentMethod: {
            type: String,
            required: [true, "Order payment method is required"]
        },

        country: {
            type: String,
            required: [true, "Order address country is required"]
        },

        city: {
            type: String,
            required: [true, "Order address city is required"]
        },

        zipcode: {
            type: String,
            required: [true, "Order address zipcode is required"]
        },

        street: {
            type: String,
            required: [true, "Order address street is required"]
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

const Order = model("Order", orderSchema);
export default Order;
