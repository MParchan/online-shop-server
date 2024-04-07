import { Request, Response } from "express";
import Subcategory from "../models/subcategoriesModel";
import { Types } from "mongoose";
import Category from "../models/categoriesModel";
import { AuthorizedRequest } from "../types/interfaces/authorizedRequestInterface";
import isAdmin from "../middleware/isAdminHandler";

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
//@access private
const createSubcategory = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req, res);
        if (!admin) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }
        const { name, category }: { name: string; category: string } = req.body;
        if (!name || !category) {
            res.status(400).json({ message: "Fields name and category are mandatory" });
            return;
        }

        if (!Types.ObjectId.isValid(category)) {
            res.status(400).json({ message: "Invalid category id" });
            return;
        }

        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            res.status(400).json({ message: "Category not found" });
            return;
        }

        const subcategory = await Subcategory.create({ name, category });
        res.status(201).json(subcategory);
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
            res.status(400).json({ message: "Invalid id" });
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
//@access private
const updateSubcategory = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req, res);
        if (!admin) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }
        const id: string = req.params.id;
        const { name, category }: { name: string; category: string } = req.body;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const subcategory = await Subcategory.findById(id);
        if (!subcategory) {
            res.status(404).json({ message: "Subcategory not found" });
            return;
        }

        if (category) {
            if (!Types.ObjectId.isValid(category)) {
                res.status(400).json({ message: "Invalid category id" });
                return;
            }
            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                res.status(400).json({ message: "Category not found" });
                return;
            } else {
                subcategory.category = new Types.ObjectId(category);
            }
        }

        if (name) {
            subcategory.name = name;
        }
        await subcategory.save();
        res.status(200).json(subcategory);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Delete subcategory
//@route DELETE /api/<API_VERSION>/subcategories/:id
//@access private
const deleteSubcategory = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req, res);
        if (!admin) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const subcategory = await Subcategory.findByIdAndDelete(id);
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

export { getSubcategories, createSubcategory, getSubcategory, updateSubcategory, deleteSubcategory };
