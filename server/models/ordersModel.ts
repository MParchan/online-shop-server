import { Schema, model } from "mongoose";

const orderSchema = new Schema(
    {
        date: {
            type: Date,
            require: [true, "Order date is required"],
        },

        status: {
            type: String,
            require: [true, "Order status is required"],
        },

        paymentMethod: {
            type: String,
            require: [true, "Order payment method is required"],
        },

        country: {
            type: String,
            require: [true, "Order address country is required"],
        },

        city: {
            type: String,
            require: [true, "Order address city is required"],
        },

        zipcode: {
            type: String,
            require: [true, "Order address zipcode is required"],
        },

        street: {
            type: String,
            require: [true, "Order address street is required"],
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            require: [true, "Order user is required"],
        }

    },
    {
        timestamps: true,
    }
);

const Order = model("Order", orderSchema);
export default Order;