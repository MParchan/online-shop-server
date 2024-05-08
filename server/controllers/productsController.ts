import { Request, Response } from "express";
import Product from "../models/productsModel";
import Property from "../models/propertiesModel";
import Image from "../models/imagesModel";
import { IProduct } from "../types/mongodb/product.interface";
import { IImage } from "../types/mongodb/image.interface";
import { Types, startSession } from "mongoose";
import { IProperty } from "../types/mongodb/property.interface";
import ProductProperty from "../models/productPropertiesModel";
import Subcategory from "../models/subcategoriesModel";
import Brand from "../models/brandsModel";

//@desc Get all products
//@route GET /api/<API_VERSION>/products
//@access public
const getProducts = async (req: Request, res: Response) => {
    try {
        const subcategory: string = String(req.query.subcategory);
        const brand: string = String(req.query.brand);
        const page: number = Number(req.query.page) || 1;
        const limit: number = Number(req.query.limit) || 20;
        const skip: number = (page - 1) * limit;
        const sortField: string = String(req.query.sortField || "createdAt");
        const sortOrder: number = req.query.sortOrder === "desc" ? -1 : 1;

        const queryOptions = { skip, limit, sort: { [sortField]: sortOrder } };
        const queryConditions: { subcategory?: string; brand?: string } = {};
        if (subcategory !== "undefined") {
            if (!Types.ObjectId.isValid(subcategory)) {
                return res.status(400).json({ message: "Invalid subcategory id" });
            }
            queryConditions.subcategory = subcategory;
        }
        if (brand !== "undefined") {
            if (!Types.ObjectId.isValid(brand)) {
                return res.status(400).json({ message: "Invalid brand id" });
            }
            queryConditions.brand = brand;
        }

        const products = await Product.find(queryConditions, null, queryOptions);
        res.status(200).json(products);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Create new product
//@route POST /api/<API_VERSION>/products
//@access private- Admin only
const createProduct = async (req: Request, res: Response) => {
    try {
        const product: IProduct = req.body;
        const properties: IProperty[] = req.body.properties;
        const images: IImage[] = req.body.images;

        if (!Types.ObjectId.isValid(product.subcategory)) {
            res.status(400).json({ message: "Invalid subcategory id" });
            return;
        }
        if (!Types.ObjectId.isValid(product.brand)) {
            res.status(400).json({ message: "Invalid brand id" });
            return;
        }
        const existingSubcategory = await Subcategory.findById(product.subcategory);
        if (!existingSubcategory) {
            res.status(404).json({ message: "Subcategory not found" });
            return;
        }
        const existingBrand = await Brand.findById(product.brand);
        if (!existingBrand) {
            res.status(404).json({ message: "Brand not found" });
            return;
        }

        product.images = [];
        product.productProperties = [];
        const productInstance = new Product(product);
        await productInstance.validate();

        const session = await startSession();
        session.startTransaction();
        try {
            if (properties) {
                await Promise.all(
                    properties.map(async (property) => {
                        const existingProperty = await Property.findOne({
                            value: property.value,
                            propertyType: property.propertyType
                        });
                        let productPropertyInstace;
                        if (existingProperty) {
                            productPropertyInstace = new ProductProperty({
                                product: productInstance._id,
                                property: existingProperty._id
                            });
                            existingProperty.productProperties.push(productPropertyInstace._id);
                            await existingProperty.validate();
                            await existingProperty.save();
                        } else {
                            const propertyInstance = new Property(property);
                            await propertyInstance.validate();
                            productPropertyInstace = new ProductProperty({
                                product: productInstance._id,
                                property: propertyInstance._id
                            });
                            propertyInstance.productProperties.push(productPropertyInstace._id);
                            await propertyInstance.validate();
                            await propertyInstance.save();
                        }
                        await productPropertyInstace.validate();
                        await productPropertyInstace.save();
                        productInstance.productProperties.push(productPropertyInstace._id);
                    })
                );
            }

            if (images) {
                await Promise.all(
                    images.map(async (image) => {
                        const modifiedImage = { ...image, product: productInstance._id };
                        const imageInstance = new Image(modifiedImage);
                        await imageInstance.validate();
                        await imageInstance.save();
                        productInstance.images.push(imageInstance._id);
                    })
                );
            }

            await productInstance.save();
        } catch (err) {
            await session.abortTransaction();
            throw err;
        }
        session.endSession();

        res.status(201).json(productInstance);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Get product
//@route GET /api/<API_VERSION>/products/:id
//@access public
const getProduct = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const product = await Product.findById(id)
            .populate({
                path: "subcategory",
                select: "name",
                populate: {
                    path: "category",
                    select: "name"
                }
            })
            .populate({
                path: "brand",
                select: "name"
            })
            .populate({
                path: "images",
                select: "image"
            })
            .populate({
                path: "opinions",
                select: "date rating description",
                populate: {
                    path: "user",
                    select: "firstName"
                }
            })
            .populate({
                path: "productProperties",
                select: "property",
                populate: {
                    path: "property",
                    select: "value",
                    populate: {
                        path: "propertyType",
                        select: "name"
                    }
                }
            });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json(product);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Update product
//@route PUT /api/<API_VERSION>/products/:id
//@access private - Admin only
const updateProduct = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const product: IProduct = req.body;

        const updatedproduct = await Product.findByIdAndUpdate(id, product, { new: true, runValidators: true });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json(updatedproduct);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Delete product
//@route DELETE /api/<API_VERSION>/products/:id
//@access private - Admin only
const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const category = await Product.findOneAndDelete({ _id: id });
        if (!category) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(204).json();
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getProducts, createProduct, getProduct, updateProduct, deleteProduct };
