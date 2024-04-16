import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import User from "../models/usersModel";
import { IRole } from "../types/mongodb/role.interface";

const isAdmin = async (req: AuthorizedRequest) => {
    const user = req.user;
    if (!user) {
        return false;
    }
    const userData = await User.findOne({ email: user.email }).populate<{ role: IRole }>("role").exec();
    if (!userData) {
        return false;
    }
    if (userData.role.name === "Admin") {
        return true;
    }
    return false;
};

export default isAdmin;
