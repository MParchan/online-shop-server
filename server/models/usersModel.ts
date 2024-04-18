import { Model, Schema, model } from "mongoose";
import { IUser } from "../types/mongodb/user.interface";

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
        }
    },
    {
        timestamps: true
    }
);

const User: Model<IUser> = model<IUser>("User", userSchema);
export default User;
