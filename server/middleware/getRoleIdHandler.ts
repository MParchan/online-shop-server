import { Response } from "express";
import { AuthorizedRequest } from "../types/interfaces/authorizedRequestInterface";
import Role from "../models/usersModel";

const getRoleId = async (roleName: string, req: AuthorizedRequest, res: Response) => {
    const role = await Role.findOne({ role: roleName }).exec();
    if (!role) {
        res.status(404).json({ message: "Role not found" });
        return;
    }
    return role.id;
};

export default getRoleId;
