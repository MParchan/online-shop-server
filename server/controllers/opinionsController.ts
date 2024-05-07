import { Request, Response } from "express";
import { Types } from "mongoose";
import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import Product from "../models/productsModel";
import Opinion from "../models/opinionsModel";
import getUserId from "../middleware/getUserIdHandler";
import { IOpinion } from "../types/mongodb/opinion.interface";

//@desc Get all product opinions
//@route GET /api/<API_VERSION>/opinions
//@access public
const getOpinions = async (req: Request, res: Response) => {
    try {
        const product = String(req.query.product);
        const queryConditions: { product?: string } = {};
        if (product !== "undefined") {
            if (!Types.ObjectId.isValid(product)) {
                return res.status(400).json({ message: "Invalid product id" });
            }
            queryConditions.product = product;
        }

        const opinions = await Opinion.find(queryConditions);
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
        const user = await getUserId(req);
        if (!user) {
            res.status(401).json({ message: "User is not authorized" });
        }
        const opinion: IOpinion = req.body;
        opinion.user = user;
        opinion.date = new Date();

        if (!Types.ObjectId.isValid(opinion.product)) {
            res.status(400).json({ message: "Invalid product id" });
            return;
        }
        const existingProduct = await Product.findById(opinion.product);
        if (!existingProduct) {
            res.status(400).json({ message: "Product not found" });
            return;
        }

        const createdOpinion = await Opinion.create(opinion);
        res.status(201).json(createdOpinion);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Get opinion
//@route GET /api/<API_VERSION>/opinions/:id
//@access public
const getOpinion = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
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
        const user = await getUserId(req);
        const id: string = req.params.id;
        const opinion: IOpinion = req.body;

        if (opinion.product) {
            if (!Types.ObjectId.isValid(opinion.product)) {
                res.status(400).json({ message: "Invalid product id" });
                return;
            }
            const existingProduct = await Product.findById(opinion.product);
            if (!existingProduct) {
                res.status(400).json({ message: "Product not found" });
                return;
            }
        }

        const existingOpinion = await Opinion.findById(id);
        if (!existingOpinion) {
            res.status(404).json({ message: "Opinion not found" });
            return;
        }
        if (existingOpinion.user !== user) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }
        const updatedOpinion = await Opinion.findByIdAndUpdate(id, opinion, { new: true, runValidators: true });
        res.status(200).json(updatedOpinion);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Delete opinion
//@route DELETE /api/<API_VERSION>/opinions/:id
//@access private
const deleteOpinion = async (req: AuthorizedRequest, res: Response) => {
    try {
        const user = await getUserId(req);
        const id: string = req.params.id;

        const opinion = await Opinion.findById(id);
        if (!opinion) {
            res.status(404).json({ message: "Opinion not found" });
            return;
        }
        if (opinion.user !== user) {
            res.status(401).json({ message: "User not authorized" });
            return;
        }
        await opinion.deleteOne();

        res.status(204).json();
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getOpinions, createOpinion, getOpinion, updateOpinion, deleteOpinion };
