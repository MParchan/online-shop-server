import express from "express";
import validateToken from "../middleware/validateTokenHandler";
import { getProducts, createProduct } from "../controllers/productsController";
import isAdmin from "../middleware/isAdminHandler";

const router = express.Router();

router.route("/").get(getProducts).post(validateToken, isAdmin, createProduct);

export default router;
