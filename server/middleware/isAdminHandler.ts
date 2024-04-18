import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import { Response, NextFunction } from "express";
import User from "../models/usersModel";
import { IRole } from "../types/mongodb/role.interface";

const isAdmin = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: "User is not authorized" });
        return;
    }
    const userData = await User.findOne({ email: user.email }).populate<{ role: IRole }>("role").exec();
    if (!userData) {
        res.status(401).json({ message: "User is not authorized" });
        return;
    }
    if (userData.role.name !== "Admin") {
        res.status(403).json({ message: "Access denied" });
        return;
    }
    next();
};

export default isAdmin;
