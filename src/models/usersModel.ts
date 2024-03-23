import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        email: {
            type: String,
            require: [true, "User email is required"],
        },

        password: {
            type: String,
            require: [true, "User password is required"],
        },

        phoneNumber: {
            type: String,
            require: [true, "User phone number is required"],
        },

        firstName: {
            type: String,
        },

        lastName: {
            type: String,
        },

        role: {
            type: Schema.Types.ObjectId,
            ref: "Role",
            require: [true, "User role is required"],
        },
    },
    {
        timestamps: true,
    }
);

const User = model("User", userSchema);
export default User;