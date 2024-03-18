import { Request, Response } from 'express';
import asyncHandler from "express-async-handler";
import Category from "../models/categoriesModel";
import { Types } from 'mongoose';

//@desc Get all categories
//@route GET /api/categories
//@access public
const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await Category.find();
    res.status(200).json(categories);
});

//@desc Create new category
//@route POST /api/categories
//@access public
const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name }: { name: string } = req.body;
    if (!name) {
        res.status(400).json({ message: "All fields are mandatory" });
        return;
    }
    const category = await Category.create({ name });
    res.status(201).json(category);
});

//@desc Get category
//@route GET /api/categories/:id
//@access public
const getCategory = asyncHandler(async (req: Request, res: Response) => {
    const categoryId: string = req.params.id;
    if (!Types.ObjectId.isValid(categoryId)) {
        res.status(400).json({ message: "Invalid categoryId" });
        return;
    }
    const category = await Category.findById(categoryId);
    if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
    }
    res.status(200).json(category);
});

//@desc Update category
//@route PUT /api/categories/:id
//@access public
const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const categoryId: string = req.params.id;
    const { name }: { name: string } = req.body;
    if (!Types.ObjectId.isValid(categoryId)) {
        res.status(400).json({ message: "Invalid categoryId" });
        return;
    }
    const category = await Category.findById(categoryId);
    if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
    }
    category.name = name;
    await category.save();
    res.status(200).json(category);
});


//@desc Delete category
//@route DELETE /api/categories/:id
//@access public
const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const categoryId: string = req.params.id;
    if (!Types.ObjectId.isValid(categoryId)) {
        res.status(400).json({ message: "Invalid categoryId" });
        return;
    }
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
    }
    res.status(200).json(category);
});

export { getCategories, createCategory, getCategory, updateCategory, deleteCategory };