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
import PropertyType from "../models/propertyTypesModel";
import Opinion from "../models/opinionsModel";

//@desc Get all products
//@route GET /api/<API_VERSION>/products
//@access public
const getProducts = async (req: Request, res: Response) => {
    try {
        // Query parameters
        const subcategory: string = String(req.query.subcategory);
        const brands: string[] = (req.query.brands as string)?.split(",") || [];
        const category: string = String(req.query.category);
        const name: string = String(req.query.name || "");
        const properties: string[] = (req.query.properties as string)?.split(",") || [];
        const available: boolean = req.query.available === undefined || req.query.available === "true";
        const page: number = Number(req.query.page) || 1;
        const limit: number = Number(req.query.limit) || 20;
        const skip: number = (page - 1) * limit;
        const sortField: string = String(req.query.sortField || "createdAt");
        const sortOrder: 1 | -1 = req.query.sortOrder === "desc" ? -1 : 1;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const matchConditions: { [key: string]: any } = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const matchBrandCondition: { [key: string]: any } = {};

        // Subcategory filtering
        if (subcategory !== "undefined") {
            if (!Types.ObjectId.isValid(subcategory)) {
                return res.status(400).json({ message: "Invalid subcategory id" });
            }
            matchConditions.subcategory = new Types.ObjectId(subcategory);
            matchBrandCondition.subcategory = new Types.ObjectId(subcategory);
        }

        // Category filtering
        if (category !== "undefined") {
            if (!Types.ObjectId.isValid(category)) {
                return res.status(400).json({ message: "Invalid category id" });
            }
            const subcategories = await Subcategory.find({ category }).select("_id");
            const subcategoryIds = subcategories.map((subcat) => subcat._id);
            matchConditions.subcategory = { $in: subcategoryIds };
            matchBrandCondition.subcategory = { $in: subcategoryIds };
        }

        // Brand filtering
        if (brands.length > 0) {
            const invalidBrands = brands.filter((brand) => !Types.ObjectId.isValid(brand));
            if (invalidBrands.length > 0) {
                return res.status(400).json({ message: "Invalid brand id(s)" });
            }
            matchConditions.brand = { $in: brands.map((brand) => new Types.ObjectId(brand)) };
        }

        // Products searching
        if (name) {
            matchConditions.name = { $regex: name, $options: "i" };
            matchBrandCondition.name = { $regex: name, $options: "i" };
        }

        // Filtering available products
        if (available) {
            matchConditions.quantity = { $gt: 0 };
            matchBrandCondition.quantity = { $gt: 0 };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pipeline: any[] = [{ $match: matchConditions }];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const brandPipeline: any[] = [{ $match: matchBrandCondition }];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const propertyPipeline: any[] = [{ $match: matchConditions }];

        // Properties filtering
        if (properties.length > 0) {
            const invalidProperties = properties.filter((property) => !Types.ObjectId.isValid(property));
            if (invalidProperties.length > 0) {
                return res.status(400).json({ message: "Invalid property id(s)" });
            }

            const propertiesWithTypes = await Property.aggregate([
                { $match: { _id: { $in: properties.map((property) => new Types.ObjectId(property)) } } },
                {
                    $lookup: {
                        from: "propertytypes",
                        localField: "propertyType",
                        foreignField: "_id",
                        as: "propertyType"
                    }
                },
                { $unwind: "$propertyType" }
            ]);
            const groupedProperties = propertiesWithTypes.reduce((acc, property) => {
                const propertyTypeId = property.propertyType._id.toString();
                if (!acc[propertyTypeId]) {
                    acc[propertyTypeId] = [];
                }
                acc[propertyTypeId].push(property._id);
                return acc;
            }, {});

            const propertyConditions = Object.values(groupedProperties).map((propertyIds) => {
                return { "productProperties.property": { $in: propertyIds } };
            });

            pipeline.push(
                {
                    $lookup: {
                        from: "productproperties",
                        localField: "_id",
                        foreignField: "product",
                        as: "productProperties"
                    }
                },
                {
                    $match: {
                        $and: propertyConditions
                    }
                },
                {
                    $unwind: "$productProperties"
                }
            );
            brandPipeline.push(
                {
                    $lookup: {
                        from: "productproperties",
                        localField: "_id",
                        foreignField: "product",
                        as: "productProperties"
                    }
                },
                {
                    $match: {
                        $and: propertyConditions
                    }
                }
            );

            propertyPipeline.push(
                {
                    $lookup: {
                        from: "productproperties",
                        localField: "_id",
                        foreignField: "product",
                        as: "productProperties"
                    }
                },
                {
                    $match: {
                        $and: propertyConditions
                    }
                }
            );
        }

        // Get products
        pipeline.push(
            {
                $lookup: {
                    from: "productproperties",
                    localField: "_id",
                    foreignField: "product",
                    as: "productProperties"
                }
            },
            {
                $unwind: "$productProperties"
            },
            {
                $lookup: {
                    from: "properties",
                    localField: "productProperties.property",
                    foreignField: "_id",
                    as: "productProperties.property"
                }
            },
            {
                $unwind: "$productProperties.property"
            },
            {
                $lookup: {
                    from: "propertytypes",
                    localField: "productProperties.property.propertyType",
                    foreignField: "_id",
                    as: "productProperties.property.propertyType"
                }
            },
            {
                $lookup: {
                    from: "images",
                    localField: "images",
                    foreignField: "_id",
                    as: "images"
                }
            },
            {
                $lookup: {
                    from: "opinions",
                    localField: "opinions",
                    foreignField: "_id",
                    as: "opinions"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    price: { $first: "$price" },
                    quantity: { $first: "$quantity" },
                    subcategory: { $first: "$subcategory" },
                    brand: { $first: "$brand" },
                    images: { $first: "$images" },
                    opinions: { $first: "$opinions" },
                    productProperties: { $push: "$productProperties" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" }
                }
            },
            {
                $project: {
                    name: 1,
                    price: 1,
                    quantity: 1,
                    subcategory: 1,
                    brand: 1,
                    images: 1,
                    opinions: 1,
                    "productProperties._id": 1,
                    "productProperties.property._id": 1,
                    "productProperties.property.value": 1,
                    "productProperties.property.propertyType._id": 1,
                    "productProperties.property.propertyType.name": 1,
                    "productProperties.property.propertyType.type": 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $sort: { [sortField]: sortOrder }
            }
        );

        // Get brands
        brandPipeline.push(
            {
                $lookup: {
                    from: "brands",
                    localField: "brand",
                    foreignField: "_id",
                    as: "brands"
                }
            },
            {
                $unwind: "$brands"
            },
            {
                $group: {
                    _id: "$brand",
                    count: { $sum: 1 },
                    brand: { $first: "$brands" }
                }
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    "brand.name": 1
                }
            }
        );

        propertyPipeline.push(
            {
                $lookup: {
                    from: "productproperties",
                    localField: "_id",
                    foreignField: "product",
                    as: "productProperties"
                }
            },
            { $unwind: "$productProperties" },
            {
                $group: {
                    _id: "$productProperties.property",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "properties",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productProperties.property"
                }
            },
            {
                $unwind: "$productProperties.property"
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    property: {
                        _id: "$productProperties.property._id",
                        value: "$productProperties.property.value",
                        propertyType: "$productProperties.property.propertyType"
                    }
                }
            }
        );

        const allProducts = await Product.aggregate(pipeline).exec();
        const brandCount = await Product.aggregate(brandPipeline).exec();
        const propertyCount = await Product.aggregate(propertyPipeline).exec();
        const productCount = allProducts.length;
        const paginatedProducts = allProducts.slice(skip, skip + limit);

        res.status(200).json({
            products: paginatedProducts,
            brands: brandCount,
            properties: propertyCount,
            productCount: productCount
        });
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
                    properties.map(async (property: IProperty) => {
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
                            if (!Types.ObjectId.isValid(property.propertyType)) {
                                const error = new Error("Invalid property type id");
                                error.name = "ValidationError";
                                throw error;
                            }
                            const existingPropertyType = await PropertyType.findById(property.propertyType);
                            if (!existingPropertyType) {
                                const error = new Error("Property type not found");
                                error.name = "NotFound";
                                throw error;
                            }
                            if (!existingPropertyType.subcategory.equals(product.subcategory)) {
                                const error = new Error("Property type does not belong to the product subcategory");
                                error.name = "ValidationError";
                                throw error;
                            }
                            existingPropertyType.properties.push(propertyInstance._id);
                            await existingPropertyType.validate();
                            await existingPropertyType.save();
                        }
                        await productPropertyInstace.validate();
                        await productPropertyInstace.save();
                        productInstance.productProperties.push(productPropertyInstace._id);
                    })
                );
            }

            if (images) {
                await Promise.all(
                    images.map(async (image: IImage) => {
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
        } else if (error.name === "NotFound") {
            res.status(404).json({ message: error.message });
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
                select: "image main"
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

//@desc Get product opinions
//@route GET /api/<API_VERSION>/products/:id/opinions
//@access public
const getProductOpinions = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        const opinions = await Opinion.find({ product: id }).populate({ path: "user", select: "firstName" });
        res.status(200).json(opinions);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getProducts, createProduct, getProduct, updateProduct, deleteProduct, getProductOpinions };
