import express from "express";
import validateToken from "../middleware/validateTokenHandler";
import {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productsController";
import isAdmin from "../middleware/isAdminHandler";
import validateId from "../middleware/validateIdHandler";

const router = express.Router();

router.route("/").get(getProducts).post(validateToken, isAdmin, createProduct);
router
    .route("/:id")
    .get(validateId, getProduct)
    .put(validateId, validateToken, isAdmin, updateProduct)
    .delete(validateId, validateToken, isAdmin, deleteProduct);

export default router;
