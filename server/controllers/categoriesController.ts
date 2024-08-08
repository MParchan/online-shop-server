import { Request, Response } from "express";
import Category from "../models/categoriesModel";
import { ICategory } from "../types/mongodb/category.interface";
import Product from "../models/productsModel";
import { ISubcategory } from "../types/mongodb/subcategory.interface";

//@desc Get all categories
//@route GET /api/<API_VERSION>/categories
//@access public
const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find().populate({ path: "subcategories", select: "name" });
        res.status(200).json(categories);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Create new category
//@route POST /api/<API_VERSION>/categories
//@access private - Admin only
const createCategory = async (req: Request, res: Response) => {
    try {
        const category: ICategory = req.body;
        const createdCategory = await Category.create(category);
        res.status(201).json(createdCategory);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Get category
//@route GET /api/<API_VERSION>/categories/:id
//@access public
const getCategory = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const category = await Category.findById(id).populate({ path: "subcategories", select: "name" });
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }

        const subcategoriesWithProductCount = await Promise.all(
            (category.subcategories as ISubcategory[]).map(async (subcategory) => {
                const productCount = await Product.countDocuments({ subcategory: subcategory._id });
                return {
                    ...subcategory.toObject(),
                    productCount
                };
            })
        );
        const categoryWithProductCount = {
            ...category.toObject(),
            subcategories: subcategoriesWithProductCount
        };

        res.status(200).json(categoryWithProductCount);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Update category
//@route PUT /api/<API_VERSION>/categories/:id
//@access private - Admin only
const updateCategory = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const category: ICategory = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(id, category, { new: true, runValidators: true });
        if (!updatedCategory) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        res.status(200).json(updatedCategory);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Delete category
//@route DELETE /api/<API_VERSION>/categories/:id
//@access private - Admin only
const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const category = await Category.findOneAndDelete({ _id: id });
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
