import { Request, Response } from "express";
import Category from "../models/categoriesModel";
import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import isAdmin from "../middleware/isAdminHandler";
import Product from "../models/productsModel";

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
const createProduct = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req, res);
        if (!admin) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        const {
            name,
            description,
            price,
            quantity,
            subcategory,
            brand
        }: { name: string; description: string; price: number; quantity: number; subcategory: string; brand: string } =
            req.body;
        if (!name || !description || !price || !quantity || !subcategory || !brand) {
            res.status(400).json({
                message: "Fields name, description, price, quantity, subcategory and brand is mandatory"
            });
            return;
        }
        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getProducts, createProduct };
