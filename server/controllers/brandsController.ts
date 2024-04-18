import { Request, Response } from "express";
import { Types } from "mongoose";
import Brand from "../models/brandsModel";
import { IBrand } from "../types/mongodb/brand.interface";

//@desc Get all brands
//@route GET /api/<API_VERSION>/brands
//@access public
const getBrands = async (req: Request, res: Response) => {
    try {
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
        if (!Types.ObjectId.isValid(id)) {
            res.status(404).json({ message: "Invalid id" });
            return;
        }
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
        if (!Types.ObjectId.isValid(id)) {
            res.status(404).json({ message: "Invalid id" });
            return;
        }

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
        if (!Types.ObjectId.isValid(id)) {
            res.status(404).json({ message: "Invalid id" });
            return;
        }
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
