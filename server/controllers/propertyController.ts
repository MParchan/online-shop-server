import { Request, Response } from "express";
import { Types } from "mongoose";
import PropertyType from "../models/propertyTypesModel";
import Property from "../models/propertiesModel";
import { IProperty } from "../types/mongodb/property.interface";

//@desc Get all property types properties
//@route GET /api/<API_VERSION>/properties
//@access public
const getProperties = async (req: Request, res: Response) => {
    try {
        const propertyType: string = String(req.query.propertyType);
        const queryConditions: { propertyType?: string } = {};
        if (propertyType !== "undefined") {
            if (!Types.ObjectId.isValid(propertyType)) {
                return res.status(400).json({ message: "Invalid property type id" });
            }
            queryConditions.propertyType = propertyType;
        }

        const properties = await Property.find(queryConditions);
        res.status(200).json(properties);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Create new property
//@route POST /api/<API_VERSION>/properties
//@access private - Admin only
const createProperty = async (req: Request, res: Response) => {
    try {
        const property: IProperty = req.body;
        if (!Types.ObjectId.isValid(property.propertyType)) {
            res.status(400).json({ message: "Invalid property type id" });
            return;
        }

        const existingPropertyType = await PropertyType.findById(property.propertyType);
        if (!existingPropertyType) {
            res.status(400).json({ message: "Property type not found" });
            return;
        }
        const createdProperty = await Property.create(property);
        existingPropertyType.properties.push(createdProperty._id);
        await existingPropertyType.save();
        res.status(201).json(createdProperty);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Get property
//@route GET /api/<API_VERSION>/properties/:id
//@access public
const getProperty = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const property = await Property.findById(id).populate("propertyType");
        if (!property) {
            res.status(404).json({ message: "Property not found" });
            return;
        }
        res.status(200).json(property);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Update property
//@route PUT /api/<API_VERSION>/properties/:id
//@access private - Admin only
const updateProperty = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const property: IProperty = req.body;

        if (property.propertyType) {
            if (!Types.ObjectId.isValid(property.propertyType)) {
                res.status(400).json({ message: "Invalid property type id" });
                return;
            }
            const existingPropertyType = await PropertyType.findById(property.propertyType);
            if (!existingPropertyType) {
                res.status(400).json({ message: "Property type not found" });
                return;
            }
        }
        const updatedProperty = await Property.findByIdAndUpdate(id, property, {
            new: true,
            runValidators: true
        });
        if (!updatedProperty) {
            res.status(404).json({ message: "Property type not found" });
            return;
        }
        res.status(200).json(updatedProperty);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Delete property
//@route DELETE /api/<API_VERSION>/properties/:id
//@access private - Admin only
const deleteProperty = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const property = await Property.findOneAndDelete({ _id: id });
        if (!property) {
            res.status(404).json({ message: "Property not found" });
            return;
        }
        res.status(204).json();
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getProperties, createProperty, getProperty, updateProperty, deleteProperty };
