import { Model, Schema, model } from "mongoose";
import { IUser } from "../types/mongodb/user.interface";
import Address from "./addressesModel";

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, "User email is required"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "User password is required"]
        },
        phoneNumber: {
            type: String,
            required: [true, "User phone number is required"]
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: "Role",
            required: [true, "User role is required"]
        },

        addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
        opinions: [{ type: Schema.Types.ObjectId, ref: "Opinion" }],
        orders: [{ type: Schema.Types.ObjectId, ref: "Order" }]
    },
    {
        timestamps: true
    }
);

userSchema.pre("findOneAndDelete", async function (next) {
    const userId = this.getQuery()["_id"];
    try {
        await Address.deleteMany({ user: userId });
    } catch (err) {
        const error = err as Error;
        next(error);
    }
    next();
});

const User: Model<IUser> = model<IUser>("User", userSchema);
export default User;
