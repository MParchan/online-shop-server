import { Request } from "express";

export interface AuthorizedRequest extends Request {
    user?: {
        email: string;
    };
}
