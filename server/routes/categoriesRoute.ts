import express from "express";
import {
    getCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
} from "../controllers/categoriesController";
import validateToken from "../middleware/validateTokenHandler";

const router = express.Router();

router.route("/").get(getCategories).post(validateToken, createCategory);

router.route("/:id").get(getCategory).put(validateToken, updateCategory).delete(validateToken, deleteCategory);

export default router;
