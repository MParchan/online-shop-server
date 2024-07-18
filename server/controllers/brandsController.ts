import { Request, Response } from "express";
import Brand from "../models/brandsModel";
import { IBrand } from "../types/mongodb/brand.interface";
import { Types } from "mongoose";
import Product from "../models/productsModel";

//@desc Get all brands
//@route GET /api/<API_VERSION>/brands
//@access public
const getBrands = async (req: Request, res: Response) => {
    try {
        const subcategory: string = String(req.query.subcategory);
        if (subcategory !== "undefined") {
            if (!Types.ObjectId.isValid(subcategory)) {
                return res.status(400).json({ message: "Invalid subcategory id" });
            }
            const brands = await Product.aggregate([
                {
                    $match: {
                        subcategory: new Types.ObjectId(subcategory)
                    }
                },
                {
                    $group: {
                        _id: "$brand"
                    }
                },
                {
                    $lookup: {
                        from: "brands",
                        localField: "_id",
                        foreignField: "_id",
                        as: "brandDetails"
                    }
                },
                {
                    $unwind: "$brandDetails"
                },
                {
                    $replaceRoot: {
                        newRoot: "$brandDetails"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                }
            ]);
            return res.status(200).json(brands);
        }
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Create new brand
//@route POST /api/<API_VERSION>/bradns
//@access private - admin only
const createBrand = async (req: Request, res: Response) => {
    try {
        const brand: IBrand = req.body;
        const createdBrand = await Brand.create(brand);
        res.status(201).json(createdBrand);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Get brnad
//@route GET /api/<API_VERSION>/brands/:id
//@access public
const getBrand = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const brand = await Brand.findById(id);
        if (!brand) {
            res.status(404).json({ message: "Brand not found" });
            return;
        }
        res.status(200).json(brand);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Update brand
//@route PUT /api/<API_VERSION>/brands/:id
//@access private - Admin only
const updateBrand = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const brand: IBrand = req.body;

        const updatedBrand = await Brand.findByIdAndUpdate(id, brand, { new: true, runValidators: true });
        if (!brand) {
            res.status(404).json({ message: "Brand not found" });
            return;
        }
        res.status(200).json(updatedBrand);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Delete brand
//@route DELETE /api/<API_VERSION>/brands/:id
//@access private - Admin only
const deleteBrand = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const brand = await Brand.findByIdAndDelete(id);
        if (!brand) {
            res.status(404).json({ message: "Brand not found" });
            return;
        }
        res.status(204).json();
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getBrands, createBrand, getBrand, updateBrand, deleteBrand };
