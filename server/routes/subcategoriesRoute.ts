import express from "express";
import {
    getSubcategories,
    createSubcategory,
    getSubcategory,
    updateSubcategory,
    deleteSubcategory
} from "../controllers/subcategoriescontroller";
import validateToken from "../middleware/validateTokenHandler";

const router = express.Router();

router.route("/").get(getSubcategories).post(validateToken, createSubcategory);
router.route("/:id").get(getSubcategory).put(validateToken, updateSubcategory).delete(validateToken, deleteSubcategory);

export default router;
