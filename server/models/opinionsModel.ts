import { Model, Schema, model } from "mongoose";
import { IOpinion } from "../types/mongodb/opinion.interface";

const opinionSchema = new Schema<IOpinion>(
    {
        date: {
            type: Date,
            required: [true, "Opinion date is required"]
        },

        rating: {
            type: Number,
            validate: {
                validator: function (value: number) {
                    return Number.isInteger(value) && value >= 1 && value <= 5;
                },
                message: "{VALUE} is not a valid integer between 1 and 5"
            },
            required: [true, "Opinion raiting is required"]
        },

        description: {
            type: String
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Opinion user is required"]
        },

        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Opinion product is required"]
        }
    },
    {
        timestamps: true
    }
);

const Opinion: Model<IOpinion> = model<IOpinion>("Opinion", opinionSchema);
export default Opinion;
