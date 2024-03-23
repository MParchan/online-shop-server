import { Request, Response } from 'express';
import Subcategory from "../models/subcategoriesModel";
import { Types } from 'mongoose';
import Category from '../models/categoriesModel';

//@desc Get all subcategories
//@route GET /api/subcategories
//@access public
const getSubcategories = async (req: Request, res: Response) => {
    try {
        const subcategories = await Subcategory.find().populate('category');
        res.status(200).json(subcategories);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

//@desc Create new subcategory
//@route POST /api/subcategories
//@access public
const createSubcategory = async (req: Request, res: Response) => {
    try {
        const { name, category }: { name: string, category: string } = req.body;
        if (!name || !category) {
            res.status(400).json({ message: "All fields are mandatory" });
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
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

//@desc Get subcategory
//@route GET /api/subcategories/:id
//@access public
const getSubcategory = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid subcategory id" });
            return;
        }
        const subcategory = await Subcategory.findById(id).populate('category');
        if (!subcategory) {
            res.status(404).json({ message: "Subcategory not found" });
            return;
        }
        res.status(200).json(subcategory);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

//@desc Update subcategory
//@route PUT /api/subcategories/:id
//@access public
const updateSubcategory = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const { name, category }: { name: string, category: string } = req.body;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid subcategory id" });
            return;
        }
        const subcategory = await Subcategory.findById(id);
        if (!subcategory) {
            res.status(404).json({ message: 'Subcategory not found' });
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
            }
            else {
                subcategory.category = new Types.ObjectId(category);
            }
        }

        if (name) {
            subcategory.name = name;
        }
        await subcategory.save();
        res.status(200).json(subcategory);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


//@desc Delete subcategory
//@route DELETE /api/subcategories/:id
//@access public
const deleteSubcategory = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid subcategory id" });
            return;
        }
        const subcategory = await Subcategory.findByIdAndDelete(id);
        if (!subcategory) {
            res.status(404).json({ message: 'Subcategory not found' });
            return;
        }
        res.status(200).json(subcategory);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export { getSubcategories, createSubcategory, getSubcategory, updateSubcategory, deleteSubcategory };