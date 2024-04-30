import { Request, Response } from "express";
import Subcategory from "../models/subcategoriesModel";
import { Types } from "mongoose";
import PropertyType from "../models/propertyTypesModel";
import { IPropertyType } from "../types/mongodb/propertyType.interface";

//@desc Get all subcategory property types
//@route GET /api/<API_VERSION>/property-types
//@access public
const getPropertyTypes = async (req: Request, res: Response) => {
    try {
        const subcategory: string = String(req.query.subcategory);
        const queryConditions: { subcategory?: string } = {};
        if (subcategory !== "undefined") {
            if (!Types.ObjectId.isValid(subcategory)) {
                return res.status(400).json({ message: "Invalid subcategory id" });
            }
            queryConditions.subcategory = subcategory;
        }

        const propertyTypes = await PropertyType.find(queryConditions);
        res.status(200).json(propertyTypes);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Create new property type
//@route POST /api/<API_VERSION>/property-types
//@access private - Admin only
const createPropertyType = async (req: Request, res: Response) => {
    try {
        const propertyType: IPropertyType = req.body;
        if (!Types.ObjectId.isValid(propertyType.subcategory)) {
            res.status(400).json({ message: "Invalid subcategory id" });
            return;
        }

        const existingSubcategory = await Subcategory.findById(propertyType.subcategory);
        if (!existingSubcategory) {
            res.status(400).json({ message: "Subcategory not found" });
            return;
        }
        const createdPropertyType = await PropertyType.create(propertyType);
        existingSubcategory.propertyTypes.push(createdPropertyType._id);
        await existingSubcategory.save();
        res.status(201).json(createdPropertyType);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Get property type
//@route GET /api/<API_VERSION>/property-types/:id
//@access public
const getPropertyType = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(404).json({ message: "Invalid id" });
            return;
        }
        const propertyType = await PropertyType.findById(id).populate("subcategory");
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
const updatePropertyType = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const propertyType: IPropertyType = req.body;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }

        if (propertyType.subcategory) {
            if (!Types.ObjectId.isValid(propertyType.subcategory)) {
                res.status(400).json({ message: "Invalid subcategory id" });
                return;
            }
            const existingSubcategory = await Subcategory.findById(propertyType.subcategory);
            if (!existingSubcategory) {
                res.status(400).json({ message: "Subcategory not found" });
                return;
            }
        }
        const updatedPropertyType = await PropertyType.findByIdAndUpdate(id, propertyType, {
            new: true,
            runValidators: true
        });
        if (!updatedPropertyType) {
            res.status(404).json({ message: "Property type not found" });
            return;
        }
        res.status(200).json(updatedPropertyType);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Delete property type
//@route DELETE /api/<API_VERSION>/property-types/:id
//@access private - Admin only
const deletePropertyType = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(404).json({ message: "Invalid id" });
            return;
        }
        const propertyType = await PropertyType.findOneAndDelete({ _id: id });
        if (!propertyType) {
            res.status(404).json({ message: "Property type not found" });
            return;
        }
        res.status(204).json();
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getPropertyTypes, createPropertyType, getPropertyType, updatePropertyType, deletePropertyType };
