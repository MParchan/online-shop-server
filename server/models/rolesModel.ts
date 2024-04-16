import { Schema, model } from "mongoose";
import { IRole } from "../types/mongodb/role.interface";

const RoleModel = model(
    "Role",
    new Schema<IRole>(
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
    )
);

export default RoleModel;
