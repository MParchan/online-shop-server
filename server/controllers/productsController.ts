import { Request, Response } from "express";
import Product from "../models/productsModel";
import Property from "../models/propertiesModel";
import Image from "../models/imagesModel";
import { IProduct } from "../types/mongodb/product.interface";
import { IProperty } from "../types/mongodb/property.interface";
import { IImage } from "../types/mongodb/image.interface";
import { Types } from "mongoose";

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
        const { properties, images, ...product }: { properties?: IProperty[]; images?: IImage[] } & IProduct = req.body;

        const createdProduct = new Product(product);
        try {
            await createdProduct.validate();
        } catch (err) {
            const error = err as Error;
            res.status(400).json({ message: error.message });
            return;
        }

        if (properties && properties.length > 0) {
            properties.forEach((property) => {
                property.product = createdProduct._id;
            });
            const createdPropetries = new Property(properties);
            try {
                await createdPropetries.validate();
            } catch (err) {
                const error = err as Error;
                res.status(400).json({ message: error.message });
                return;
            }
        }

        if (images && images.length > 0) {
            const createdImages: IImage[] = [];
            images.forEach(async (image) => {
                image.product = createdProduct._id;
                const createdImage = new Image(image);
                try {
                    await createdImage.validate();
                } catch (err) {
                    const error = err as Error;
                    res.status(400).json({ message: error.message });
                    return;
                }
                createdImages.push(createdImage);
            });
            if (createdImages.length < images.length) {
                return;
            }
        }

        res.status(201).json(createdProduct);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getProducts, createProduct };
