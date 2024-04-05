import { Request, Response } from "express";
import Category from "../models/categoriesModel";
import { Types } from "mongoose";

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
//@access public
const createCategory = async (req: Request, res: Response) => {
    try {
        const { name }: { name: string } = req.body;
        if (!name) {
            res.status(400).json({ message: "All fields are mandatory" });
            return;
        }
        const category = await Category.create({ name });
        res.status(201).json(category);
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
            res.status(400).json({ message: "Invalid category id" });
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
//@access public
const updateCategory = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const { name }: { name: string } = req.body;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid category id" });
            return;
        }
        const category = await Category.findById(id);
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        category.name = name;
        await category.save();
        res.status(200).json(category);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Delete category
//@route DELETE /api/<API_VERSION>/categories/:id
//@access public
const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid category id" });
            return;
        }
        const category = await Category.findByIdAndDelete(id);
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

export { getCategories, createCategory, getCategory, updateCategory, deleteCategory };
