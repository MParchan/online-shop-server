import { Request, Response } from "express";
import { Types } from "mongoose";
import { AuthorizedRequest } from "../types/interfaces/authorizedRequestInterface";
import isAdmin from "../middleware/isAdminHandler";
import Product from "../models/productsModel";
import Opinion from "../models/opinionsModel";
import getUserId from "../middleware/getUserIdHandler";

//@desc Get all product opinions
//@route GET /api/<API_VERSION>/opinions
//@access public
const getOpinions = async (req: Request, res: Response) => {
    try {
        const productId = req.body.productId;
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        const opinions = await Opinion.findById({ product: productId });
        res.status(200).json(opinions);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Create new opinion
//@route POST /api/<API_VERSION>/opinions
//@access private
const createOpinion = async (req: AuthorizedRequest, res: Response) => {
    try {
        const user = await getUserId(req, res);
        const { rating, description, product }: { rating: number; description: string; product: string } = req.body;
        if (!rating || !description || !product) {
            res.status(400).json({ message: "Fields rating, description and product are mandatory" });
            return;
        }

        if (!Types.ObjectId.isValid(product)) {
            res.status(400).json({ message: "Invalid product id" });
            return;
        }

        const existingProduct = await Product.findById(product);
        if (!existingProduct) {
            res.status(400).json({ message: "Product not found" });
            return;
        }
        const date = Date.now();
        const opinion = await Opinion.create({ date, rating, description, product, user });
        res.status(201).json(opinion);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Get opinion
//@route GET /api/<API_VERSION>/opinions/:id
//@access public
const getOpinion = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const opinion = await Opinion.findById(id);
        if (!opinion) {
            res.status(404).json({ message: "Opinion not found" });
            return;
        }
        res.status(200).json(opinion);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Update opinion
//@route PUT /api/<API_VERSION>/opinions/:id
//@access private
const updateOpinion = async (req: AuthorizedRequest, res: Response) => {
    try {
        const user = await getUserId(req, res);
        const id: string = req.params.id;
        const { rating, description }: { rating: number; description: string } = req.body;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const opinion = await Opinion.findById(id);
        if (!opinion) {
            res.status(404).json({ message: "Opinion not found" });
            return;
        }
        if (opinion.user !== user) {
            res.status(401).json({ message: "User not authorized" });
            return;
        }

        if (rating) {
            opinion.rating = rating;
        }
        if (description) {
            opinion.description = description;
        }
        await opinion.save();

        res.status(200).json(opinion);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Delete opinion
//@route DELETE /api/<API_VERSION>/opinions/:id
//@access private
const deleteOpinion = async (req: AuthorizedRequest, res: Response) => {
    try {
        const admin = await isAdmin(req, res);
        const user = await getUserId(req, res);
        const id: string = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const opinion = await Opinion.findById(id);
        if (!opinion) {
            res.status(404).json({ message: "Opinion not found" });
            return;
        }
        if (opinion.user !== user) {
            if (!admin) {
                res.status(401).json({ message: "User not authorized" });
                return;
            }
        }
        await opinion.deleteOne();

        res.status(204).json();
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getOpinions, createOpinion, getOpinion, updateOpinion, deleteOpinion };
