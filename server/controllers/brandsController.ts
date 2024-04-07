import { Request, Response } from "express";
import { Types } from "mongoose";
import { AuthorizedRequest } from "../types/interfaces/authorizedRequestInterface";
import isAdmin from "../middleware/isAdminHandler";
import Brand from "../models/brandsModel";

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
//@access private
const createBrand = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req, res);
        if (!admin) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }
        const { name }: { name: string } = req.body;
        if (!name) {
            res.status(400).json({ message: "Field name is mandatory" });
            return;
        }
        const brand = await Brand.create({ name });
        res.status(201).json(brand);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Get brnad
//@route GET /api/<API_VERSION>/brands/:id
//@access public
const getBrand = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid id" });
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
//@access private
const updateBrand = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req, res);
        if (!admin) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }
        const id: string = req.params.id;
        const { name }: { name: string } = req.body;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const brand = await Brand.findByIdAndUpdate(id, { name: name });
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

//@desc Delete brand
//@route DELETE /api/<API_VERSION>/brands/:id
//@access private
const deleteBrand = async (req: AuthorizedRequest, res: Response) => {
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
        const brand = await Brand.findByIdAndDelete(id);
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

export { getBrands, createBrand, getBrand, updateBrand, deleteBrand };
