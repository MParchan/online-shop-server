import { Response } from "express";
import { Types } from "mongoose";
import Role from "../models/rolesModel";
import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import isAdmin from "../middleware/isAdminHandler";

//@desc Get all roles
//@route GET /api/<API_VERSION>/roles
//@access private - Admin only
const getRoles = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req, res);
        if (!admin) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Create new role
//@route POST /api/<API_VERSION>/roles
//@access private - Admin only
const createRole = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req, res);
        if (!admin) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        const { name }: { name: string } = req.body;
        if (!name) {
            res.status(400).json({ message: "Field name is mandatory" });
            return;
        }
        const existingRole = await Role.find({ name: name });
        if (existingRole.length > 0) {
            res.status(400).json({ message: "Role already exists" });
            return;
        }
        const role = await Role.create({ name });
        res.status(201).json(role);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Get role
//@route GET /api/<API_VERSION>/roles/:id
//@access private - Admin only
const getRole = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req, res);
        if (!admin) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const role = await Role.findById(id);
        if (!role) {
            res.status(404).json({ message: "Role not found" });
            return;
        }
        res.status(200).json(role);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Update role
//@route PUT /api/<API_VERSION>/roles/:id
//@access private - Admin only
const updateRole = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req, res);
        if (!admin) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        const id: string = req.params.id;
        const { name }: { name: string } = req.body;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const role = await Role.findByIdAndUpdate(id, { name: name });
        if (!role) {
            res.status(404).json({ message: "Role not found" });
            return;
        }
        res.status(200).json(role);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Delete role
//@route DELETE /api/<API_VERSION>/roles/:id
//@access private - Admin only
const deleteRole = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req, res);
        if (!admin) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const role = await Role.findByIdAndDelete(id);
        if (!role) {
            res.status(404).json({ message: "Role not found" });
            return;
        }
        res.status(200).json(role);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getRoles, createRole, getRole, updateRole, deleteRole };
