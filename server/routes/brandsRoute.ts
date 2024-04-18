import express from "express";
import validateToken from "../middleware/validateTokenHandler";
import { getBrands, createBrand, getBrand, updateBrand, deleteBrand } from "../controllers/brandsController";
import isAdmin from "../middleware/isAdminHandler";

const router = express.Router();

router.route("/").get(getBrands).post(validateToken, isAdmin, createBrand);
router.route("/:id").get(getBrand).put(validateToken, isAdmin, updateBrand).delete(validateToken, isAdmin, deleteBrand);

export default router;
