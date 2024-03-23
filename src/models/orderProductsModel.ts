import { Schema, model } from "mongoose";

const orderProductSchema = new Schema(
    {
        quantity: {
            type: Number,
            validate: {
                validator: function (value: number) {
                    return Number.isInteger(value) && value > 0;
                },
                message: "{VALUE} is not a positive integer"
            },
            require: [true, "Order product quantity is required"],
        },

        order: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            require: [true, "Order product order is required"],
        },

        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            require: [true, "Order product product is required"],
        }
    },
    {
        timestamps: true,
    }
);

const OrderProduct = model("OrderProduct", orderProductSchema);
export default OrderProduct;