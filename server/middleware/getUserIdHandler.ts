import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import User from "../models/usersModel";

const getUserId = async (req: AuthorizedRequest) => {
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
