import { Types } from "mongoose";

export interface RoleType {
    _id: Types.ObjectId;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}
