import { Response, NextFunction } from "express";
import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import { Types } from "mongoose";

const validateId = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid id" });
        return;
    }
    next();
};

export default validateId;
