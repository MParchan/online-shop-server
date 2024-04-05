import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthorizedRequest } from "../types/interfaces/authorizedRequestInterface";

const validateToken = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
        let token;
        const authHeader: string | string[] | undefined = req.headers.Authorization || req.headers.authorization;
        const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || "secret";
        if (typeof authHeader === "string") {
            if (authHeader && authHeader.startsWith("Bearer")) {
                token = authHeader.split(" ")[1];
                jwt.verify(token, accessTokenSecret, (err, decoded) => {
                    if (err) {
                        res.status(401).json({ message: "User is not authorized" });
                        return;
                    }
                    if (typeof decoded === "string") {
                        res.status(401).json({ message: "User is not authorized" });
                        return;
                    }
                    if (!decoded || !decoded.user) {
                        res.status(401).json({ message: "User is not authorized" });
                        return;
                    }
                    req.user = decoded.user;
                    next();
                });
            }
        }

        if (!token) {
            res.status(401).json({ message: "Token is missing" });
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export default validateToken;
