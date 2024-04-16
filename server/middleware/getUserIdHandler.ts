import { Response } from "express";
import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import User from "../models/usersModel";

const getUserId = async (req: AuthorizedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: "User is not authorized" });
        return;
    }
    const userData = await User.findOne({ email: user.email }).exec();
    if (!userData) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    return userData.id;
};

export default getUserId;
