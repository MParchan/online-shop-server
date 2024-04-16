import { Request, Response } from "express";
import Subcategory from "../models/subcategoriesModel";
import { Types } from "mongoose";
import Category from "../models/categoriesModel";
import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import isAdmin from "../middleware/isAdminHandler";
import { ISubcategory } from "../types/mongodb/subcategory.interface";

//@desc Get all subcategories
//@route GET /api/<API_VERSION>/subcategories
//@access public
const getSubcategories = async (req: Request, res: Response) => {
    try {
        const subcategories = await Subcategory.find().populate("category");
        res.status(200).json(subcategories);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Create new subcategory
//@route POST /api/<API_VERSION>/subcategories
//@access private - Admin only
const createSubcategory = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req);
        if (!admin) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        const subcategory: ISubcategory = req.body;

        if (!Types.ObjectId.isValid(subcategory.category)) {
            res.status(400).json({ message: "Invalid category id" });
            return;
        }
        const existingCategory = await Category.findById(subcategory.category);
        if (!existingCategory) {
            res.status(400).json({ message: "Category not found" });
            return;
        }

        try {
            const createdSubcategory = await Subcategory.create(subcategory);
            res.status(201).json(createdSubcategory);
        } catch (err) {
            const error = err as Error;
            res.status(400).json({ message: error.message });
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Get subcategory
//@route GET /api/<API_VERSION>/subcategories/:id
//@access public
const getSubcategory = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(404).json({ message: "Invalid id" });
            return;
        }
        const subcategory = await Subcategory.findById(id).populate("category");
        if (!subcategory) {
            res.status(404).json({ message: "Subcategory not found" });
            return;
        }
        res.status(200).json(subcategory);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Update subcategory
//@route PUT /api/<API_VERSION>/subcategories/:id
//@access private - Admin only
const updateSubcategory = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req);
        if (!admin) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        const id: string = req.params.id;
        const subcategory: ISubcategory = req.body;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }

        if (subcategory.category) {
            if (!Types.ObjectId.isValid(subcategory.category)) {
                res.status(400).json({ message: "Invalid category id" });
                return;
            }
            const existingCategory = await Category.findById(subcategory.category);
            if (!existingCategory) {
                res.status(400).json({ message: "Category not found" });
                return;
            }
        }
        try {
            const updatedSubcategory = await Subcategory.findByIdAndUpdate(id, subcategory, { new: true });
            if (!updatedSubcategory) {
                res.status(404).json({ message: "Subcategory not found" });
                return;
            }
            res.status(200).json(updatedSubcategory);
        } catch (err) {
            const error = err as Error;
            res.status(400).json({ message: error.message });
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Delete subcategory
//@route DELETE /api/<API_VERSION>/subcategories/:id
//@access private - Admin only
const deleteSubcategory = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req);
        if (!admin) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(404).json({ message: "Invalid id" });
            return;
        }
        const subcategory = await Subcategory.findByIdAndDelete(id);
        if (!subcategory) {
            res.status(404).json({ message: "Subcategory not found" });
            return;
        }
        res.status(204).json();
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getSubcategories, createSubcategory, getSubcategory, updateSubcategory, deleteSubcategory };
