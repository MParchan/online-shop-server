import express from "express";
import validateToken from "../middleware/validateTokenHandler";
import { getBrands, createBrand, getBrand, updateBrand, deleteBrand } from "../controllers/brandsController";

const router = express.Router();

router.route("/").get(getBrands).post(validateToken, createBrand);
router.route("/:id").get(getBrand).put(validateToken, updateBrand).delete(validateToken, deleteBrand);

export default router;
