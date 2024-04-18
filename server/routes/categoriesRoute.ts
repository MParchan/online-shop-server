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

const router = express.Router();

router.route("/").get(getCategories).post(validateToken, isAdmin, createCategory);
router
    .route("/:id")
    .get(getCategory)
    .put(validateToken, isAdmin, updateCategory)
    .delete(validateToken, isAdmin, deleteCategory);

export default router;
