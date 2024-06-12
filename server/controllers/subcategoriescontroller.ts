import { Request, Response } from "express";
import Subcategory from "../models/subcategoriesModel";
import { Types } from "mongoose";
import Category from "../models/categoriesModel";
import { ISubcategory } from "../types/mongodb/subcategory.interface";

//@desc Get all subcategories
//@route GET /api/<API_VERSION>/subcategories
//@access public
const getSubcategories = async (req: Request, res: Response) => {
    try {
        const category: string = String(req.query.category);
        const queryConditions: { category?: string } = {};
        if (category !== "undefined") {
            if (!Types.ObjectId.isValid(category)) {
                return res.status(400).json({ message: "Invalid category id" });
            }
            queryConditions.category = category;
        }

        const subcategories = await Subcategory.find(queryConditions);
        res.status(200).json(subcategories);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Create new subcategory
//@route POST /api/<API_VERSION>/subcategories
//@access private - Admin only
const createSubcategory = async (req: Request, res: Response) => {
    try {
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

        const createdSubcategory = await Subcategory.create(subcategory);
        existingCategory.subcategories.push(createdSubcategory._id);
        await existingCategory.save();
        res.status(201).json(createdSubcategory);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Get subcategory
//@route GET /api/<API_VERSION>/subcategories/:id
//@access public
const getSubcategory = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const subcategory = await Subcategory.findById(id)
            .populate({
                path: "category",
                select: "name"
            })
            .populate({
                path: "propertyTypes",
                select: "name type",
                populate: {
                    path: "properties",
                    select: "value productProperties"
                }
            });
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
const updateSubcategory = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const subcategory: ISubcategory = req.body;

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
        const updatedSubcategory = await Subcategory.findByIdAndUpdate(id, subcategory, {
            new: true,
            runValidators: true
        });
        if (!updatedSubcategory) {
            res.status(404).json({ message: "Subcategory not found" });
            return;
        }
        res.status(200).json(updatedSubcategory);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Delete subcategory
//@route DELETE /api/<API_VERSION>/subcategories/:id
//@access private - Admin only
const deleteSubcategory = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const subcategory = await Subcategory.findOneAndDelete({ _id: id });
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
