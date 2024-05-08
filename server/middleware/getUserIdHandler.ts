import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import User from "../models/usersModel";
import { Types } from "mongoose";

const getUserId = async (req: AuthorizedRequest): Promise<Types.ObjectId | undefined> => {
    const user = req.user;
    if (!user) {
        return;
    }
    const userData = await User.findOne({ email: user.email }).exec();
    if (!userData) {
        return;
    }
    return userData.id;
};

export default getUserId;
