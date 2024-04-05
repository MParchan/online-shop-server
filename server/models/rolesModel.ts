import { Schema, model } from "mongoose";

const roleSchema = new Schema(
    {
        name: {
            type: String,
            require: [true, "Role name is required"],
            unique: true
        }
    },
    {
        timestamps: true
    }
);

const Role = model("Role", roleSchema);
export default Role;
