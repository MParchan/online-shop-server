import express from "express";
import {
    getSubcategories,
    createSubcategory,
    getSubcategory,
    updateSubcategory,
    deleteSubcategory,
} from "../controllers/subcategoriescontroller";

const router = express.Router();

router.route("/").get(getSubcategories).post(createSubcategory);

router.route("/:id").get(getSubcategory).put(updateSubcategory).delete(deleteSubcategory);

export default router;