import express from "express";
import {
    getCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/categoriesController";

const router = express.Router();

router.route("/").get(getCategories).post(createCategory);

router.route("/:id").get(getCategory).put(updateCategory).delete(deleteCategory);

export default router;