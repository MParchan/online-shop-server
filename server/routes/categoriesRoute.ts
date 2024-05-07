import express from "express";
import {
    getCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
} from "../controllers/categoriesController";
import validateToken from "../middleware/validateTokenHandler";
import isAdmin from "../middleware/isAdminHandler";
import validateId from "../middleware/validateIdHandler";

const router = express.Router();

router.route("/").get(getCategories).post(validateToken, isAdmin, createCategory);
router
    .route("/:id")
    .get(validateId, getCategory)
    .put(validateId, validateToken, isAdmin, updateCategory)
    .delete(validateId, validateToken, isAdmin, deleteCategory);

export default router;
