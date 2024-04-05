import { Request, Response } from "express";
import { Types } from "mongoose";
import Role from "../models/rolesModel";

//@desc Get all roles
//@route GET /api/<API_VERSION>/roles
//@access public
const getRoles = async (req: Request, res: Response) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Create new role
//@route POST /api/<API_VERSION>/roles
//@access public
const createRole = async (req: Request, res: Response) => {
    try {
        const { name }: { name: string } = req.body;
        if (!name) {
            res.status(400).json({ message: "All fields are mandatory" });
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
//@access public
const getRole = async (req: Request, res: Response) => {
    try {
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
//@access public
const updateRole = async (req: Request, res: Response) => {
    try {
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
//@access public
const deleteRole = async (req: Request, res: Response) => {
    try {
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
