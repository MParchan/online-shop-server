import { Response } from "express";
import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import User from "../models/usersModel";
import { IRole } from "../types/mongodb/role.interface";

const isAdmin = async (req: AuthorizedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: "User is not authorized" });
        return;
    }
    const userData = await User.findOne({ email: user.email }).populate<{ role: IRole }>("role").exec();
    if (!userData) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if (userData.role.name === "Admin") {
        return true;
    }
    return false;
};

export default isAdmin;
