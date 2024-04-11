import { Request, Response } from "express";
import Subcategory from "../models/subcategoriesModel";
import { Types } from "mongoose";
import { AuthorizedRequest } from "../types/interfaces/authorizedRequestInterface";
import isAdmin from "../middleware/isAdminHandler";
import PropertyType from "../models/propertyTypesModel";

//@desc Get all subcategory property types
//@route GET /api/<API_VERSION>/property-types
//@access public
const getPropertyTypes = async (req: Request, res: Response) => {
    try {
        const subcategory: string = req.body.subcategory;
        const propertyTypes = await Subcategory.find({ subcategory: subcategory });
        res.status(200).json(propertyTypes);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Create new property type
//@route POST /api/<API_VERSION>/property-types
//@access private - Admin only
const createPropertyType = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req, res);
        if (!admin) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        const { name, subcategory }: { name: string; subcategory: string } = req.body;
        if (!name || !subcategory) {
            res.status(400).json({ message: "Fields name and subcategory are mandatory" });
            return;
        }

        if (!Types.ObjectId.isValid(subcategory)) {
            res.status(400).json({ message: "Invalid subcategory id" });
            return;
        }

        const existingSubcategory = await Subcategory.findById(subcategory);
        if (!existingSubcategory) {
            res.status(400).json({ message: "Subcategory not found" });
            return;
        }

        const propertyType = await PropertyType.create({ name, subcategory });
        res.status(201).json(propertyType);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Get property type
//@route GET /api/<API_VERSION>/property-types/:id
//@access public
const getPropertyType = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const propertyType = await Subcategory.findById(id).populate("subcategory");
        if (!propertyType) {
            res.status(404).json({ message: "Property type not found" });
            return;
        }
        res.status(200).json(propertyType);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Update property type
//@route PUT /api/<API_VERSION>/property-types/:id
//@access private - Admin only
const updatePropertyType = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req, res);
        if (!admin) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        const id: string = req.params.id;
        const { name, subcategory }: { name: string; subcategory: string } = req.body;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const propertyType = await PropertyType.findById(id);
        if (!propertyType) {
            res.status(404).json({ message: "Property type not found" });
            return;
        }

        if (subcategory) {
            if (!Types.ObjectId.isValid(subcategory)) {
                res.status(400).json({ message: "Invalid subcategory id" });
                return;
            }
            const existingSubcategory = await Subcategory.findById(subcategory);
            if (!existingSubcategory) {
                res.status(400).json({ message: "Category not found" });
                return;
            } else {
                propertyType.subcategory = new Types.ObjectId(subcategory);
            }
        }

        if (name) {
            propertyType.name = name;
        }
        await propertyType.save();
        res.status(200).json(propertyType);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Delete property type
//@route DELETE /api/<API_VERSION>/property-types/:id
//@access private - Admin only
const deletePropertyType = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req, res);
        if (!admin) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const propertyType = await PropertyType.findByIdAndDelete(id);
        if (!propertyType) {
            res.status(404).json({ message: "Property type not found" });
            return;
        }
        res.status(200).json(propertyType);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getPropertyTypes, createPropertyType, getPropertyType, updatePropertyType, deletePropertyType };
