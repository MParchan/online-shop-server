import { Request, Response } from "express";
import Product from "../models/productsModel";
import Property from "../models/propertiesModel";
import Image from "../models/imagesModel";
import { IProduct } from "../types/mongodb/product.interface";
import { IImage } from "../types/mongodb/image.interface";
import { Types } from "mongoose";
import { IProperty } from "../types/mongodb/property.interface";
import ProductProperty from "../models/productPropertiesModel";
import { IProductProperty } from "../types/mongodb/productProperty.interface";

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

        const productInstance = new Product(product);
        await productInstance.validate();

        const propertyInstances: IProperty[] = [];
        const productPropertyInstances: IProductProperty[] = [];
        let propertyPromises;
        if (Array.isArray(properties)) {
            propertyPromises = properties.map(async (property) => {
                const existingProperty = await Property.findOne({
                    value: property.value,
                    propertyType: property.propertyType
                });
                let productpropertyInstace;
                if (existingProperty) {
                    productpropertyInstace = new ProductProperty({
                        product: productInstance._id,
                        property: existingProperty._id
                    });
                    productPropertyInstances.push(productpropertyInstace);
                    existingProperty.productProperties.push(productpropertyInstace._id);
                    await existingProperty.save();
                } else {
                    const propertyInstance = new Property(property);
                    await propertyInstance.validate();
                    productpropertyInstace = new ProductProperty({
                        product: productInstance._id,
                        property: propertyInstance._id
                    });
                    propertyInstance.productProperties.push(productpropertyInstace._id);
                    propertyInstances.push(propertyInstance);
                }
                productPropertyInstances.push(productpropertyInstace);
                productInstance.productProperties.push(productpropertyInstace._id);
            });
        }

        const imageInstances: IImage[] = [];
        let imagePromises;
        if (Array.isArray(images)) {
            imagePromises = images.map(async (image) => {
                const modifiedImage = { ...image, product: productInstance._id };
                const imageInstance = new Image(modifiedImage);
                await imageInstance.validate();
                imageInstances.push(imageInstance);
                productInstance.images.push(imageInstance._id);
            });
        }

        await Promise.all([
            imagePromises,
            propertyPromises,
            productInstance.save(),
            Image.insertMany(imageInstances),
            Property.insertMany(propertyInstances),
            ProductProperty.insertMany(productPropertyInstances)
        ]);

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

export { getProducts, createProduct };
