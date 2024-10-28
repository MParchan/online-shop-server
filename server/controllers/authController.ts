import { Request, Response } from "express";
import User from "../models/usersModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passwordValidation from "../utils/passwordValidation";
import emailValidation from "../utils/emailValidation";
import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import Role from "../models/rolesModel";
import { IUser } from "../types/mongodb/user.interface";

//@desc User registration
//@route POST /api/<API_VERSION>/auth/register
//@access public
const registerUser = async (req: Request, res: Response) => {
    try {
        const {
            confirmPassword,
            ...user
        }: {
            confirmPassword: string;
        } & IUser = req.body;

        if (
            !user.firstName ||
            !user.lastName ||
            !user.email ||
            !user.phoneNumber ||
            !user.password ||
            !confirmPassword
        ) {
            res.status(400).json({
                message: "User firstname, lastname, email, phone number, password and confirm password are mandatory"
            });
            return;
        }

        if (!emailValidation(user.email)) {
            res.status(400).json({ message: "Email is invalid" });
            return;
        }
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(400).json({ message: "User with this email already exists" });
            return;
        }

        if (user.password.length < 8) {
            res.status(400).json({ message: "Password must be at least 8 characters long" });
            return;
        }
        if (!passwordValidation(user.password)) {
            res.status(400).json({
                message:
                    "The password must contain an uppercase letter, a lowercase letter, a special character and a number"
            });
            return;
        }
        if (user.password !== confirmPassword) {
            res.status(400).json({ message: "Password and confirm password is not the same" });
            return;
        }

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        const role = await Role.findOne({ name: "User" }).exec();
        if (!role) {
            res.status(400).json({ message: "Role not found" });
            return;
        }
        user.role = role._id;
        await User.create(user);
        res.status(200).json({ message: "User register succesfully" });
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc User login
//@route GET /api/<API_VERSION>/auth/login
//@access public
const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password }: { email: string; password: string } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Fields email and password are mandatory" });
            return;
        }
        const user = await User.findOne({ email: email });
        if (!user || (user.password && !bcrypt.compare(password, user.password))) {
            res.status(400).json({ message: "Email or password is not valid" });
            return;
        }
        const accessToken = jwt.sign(
            {
                user: {
                    email: user.email,
                    firstname: user.firstName
                }
            },
            process.env.ACCESS_TOKEN_SECRET || "Secret",
            { expiresIn: "10d" }
        );
        res.status(200).json({ accessToken });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Current user info
//@route GET /api/<API_VERSION>/auth/user
//@access private
const getCurrentUser = async (req: AuthorizedRequest, res: Response) => {
    try {
        const user = req.user;
        res.status(200).json(user);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { registerUser, loginUser, getCurrentUser };
