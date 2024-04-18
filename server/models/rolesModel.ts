import { Model, Schema, model } from "mongoose";
import { IRole } from "../types/mongodb/role.interface";

const roleSchema = new Schema<IRole>(
    {
        name: {
            type: String,
            required: [true, "Role name is required"],
            unique: true
        }
    },
    {
        timestamps: true
    }
);

const Role: Model<IRole> = model<IRole>("Role", roleSchema);
export default Role;
