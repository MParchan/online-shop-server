import { Request, Response } from "express";
import Role from "../models/rolesModel";
import { IRole } from "../types/mongodb/role.interface";

//@desc Get all roles
//@route GET /api/<API_VERSION>/roles
//@access private - Admin only
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
//@access private - Admin only
const createRole = async (req: Request, res: Response) => {
    try {
        const role: IRole = req.body;
        const createdRole = await Role.create(role);
        res.status(201).json(createdRole);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Get role
//@route GET /api/<API_VERSION>/roles/:id
//@access private - Admin only
const getRole = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
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
const updateRole = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const role: IRole = req.body;
        const updatedRole = await Role.findByIdAndUpdate(id, role, { new: true, runValidators: true });
        if (!updatedRole) {
            res.status(404).json({ message: "Role not found" });
            return;
        }
        res.status(200).json(updatedRole);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Delete role
//@route DELETE /api/<API_VERSION>/roles/:id
//@access private - Admin only
const deleteRole = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const role = await Role.findByIdAndDelete(id);
        if (!role) {
            res.status(404).json({ message: "Role not found" });
            return;
        }
        res.status(204).json();
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getRoles, createRole, getRole, updateRole, deleteRole };
