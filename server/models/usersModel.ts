import { Schema, model } from "mongoose";

const userSchema = new Schema(
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

const User = model("User", userSchema);
export default User;
