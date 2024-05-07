import express from "express";
import validateToken from "../middleware/validateTokenHandler";
import { getBrands, createBrand, getBrand, updateBrand, deleteBrand } from "../controllers/brandsController";
import isAdmin from "../middleware/isAdminHandler";
import validateId from "../middleware/validateIdHandler";

const router = express.Router();

router.route("/").get(getBrands).post(validateToken, isAdmin, createBrand);
router
    .route("/:id")
    .get(validateId, getBrand)
    .put(validateId, validateToken, isAdmin, updateBrand)
    .delete(validateId, validateToken, isAdmin, deleteBrand);

export default router;
