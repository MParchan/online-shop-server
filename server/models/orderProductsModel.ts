import { Model, Schema, model } from "mongoose";
import { IOrderProduct } from "../types/mongodb/orderProduct.interface";

const orderProductSchema = new Schema<IOrderProduct>(
    {
        quantity: {
            type: Number,
            validate: {
                validator: function (value: number) {
                    return Number.isInteger(value) && value > 0;
                },
                message: "{VALUE} is not a positive integer"
            },
            required: [true, "Order product quantity is required"]
        },

        order: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: [true, "Order product order is required"]
        },

        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Order product product is required"]
        }
    },
    {
        timestamps: true
    }
);

const OrderProduct: Model<IOrderProduct> = model<IOrderProduct>("OrderProduct", orderProductSchema);
export default OrderProduct;
