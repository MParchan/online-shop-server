import { Request, Response } from "express";
import Product from "../models/productsModel";
import Property from "../models/propertiesModel";
import Image from "../models/imagesModel";
import { IProduct } from "../types/mongodb/product.interface";
import { IProperty } from "../types/mongodb/property.interface";
import { IImage } from "../types/mongodb/image.interface";

//@desc Get all products
//@route GET /api/<API_VERSION>/products
//@access public
const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
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
        const result: { properties?: IProperty[]; images?: IImage[] } & IProduct = createdProduct;
        result.properties = properties;
        result.images = images;
        res.status(201).json(result);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getProducts, createProduct };
