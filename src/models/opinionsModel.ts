import { Schema, model } from "mongoose";

const opinionSchema = new Schema(
    {
        date: {
            type: Date,
            require: [true, "Opinion date is required"],
        },

        rating: {
            type: Number,
            validate: {
                validator: function (value: number) {
                    return Number.isInteger(value) && value >= 1 && value <= 5;
                },
                message: '{VALUE} is not a valid integer between 1 and 5'
            }
        },

        description: {
            type: String,
        },

        user: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            require: [true, "Opinion user is required"],
        }],

        product: [{
            type: Schema.Types.ObjectId,
            ref: "Product",
            require: [true, "Opinion product is required"],
        }],
    },
    {
        timestamps: true,
    }
);

const Opinion = model("Opinion", opinionSchema);
export default Opinion;