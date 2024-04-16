import { Request, Response } from "express";
import Category from "../models/categoriesModel";
import { Types } from "mongoose";
import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import isAdmin from "../middleware/isAdminHandler";
import { ICategory } from "../types/mongodb/category.interface";

//@desc Get all categories
//@route GET /api/<API_VERSION>/categories
//@access public
const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Create new category
//@route POST /api/<API_VERSION>/categories
//@access private - Admin only
const createCategory = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req);
        if (!admin) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        const category: ICategory = req.body;
        try {
            const createdCategory = await Category.create(category);
            res.status(201).json(createdCategory);
        } catch (err) {
            const error = err as Error;
            res.status(400).json({ message: error.message });
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Get category
//@route GET /api/<API_VERSION>/categories/:id
//@access public
const getCategory = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(404).json({ message: "Invalid id" });
            return;
        }
        const category = await Category.findById(id);
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        res.status(200).json(category);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Update category
//@route PUT /api/<API_VERSION>/categories/:id
//@access private - Admin only
const updateCategory = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req);
        if (!admin) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        const id: string = req.params.id;
        const category: ICategory = req.body;
        if (!Types.ObjectId.isValid(id)) {
            res.status(404).json({ message: "Invalid id" });
            return;
        }
        try {
            const updatedCategory = await Category.findByIdAndUpdate(id, category, { new: true });
            if (!updatedCategory) {
                res.status(404).json({ message: "Category not found" });
                return;
            }
            res.status(200).json(updatedCategory);
        } catch (err) {
            const error = err as Error;
            res.status(400).json({ message: error.message });
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Delete category
//@route DELETE /api/<API_VERSION>/categories/:id
//@access private - Admin only
const deleteCategory = async (req: AuthorizedRequest, res: Response) => {
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
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        res.status(204).json();
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getCategories, createCategory, getCategory, updateCategory, deleteCategory };
