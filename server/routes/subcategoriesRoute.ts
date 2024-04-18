import express from "express";
import {
    getSubcategories,
    createSubcategory,
    getSubcategory,
    updateSubcategory,
    deleteSubcategory
} from "../controllers/subcategoriescontroller";
import validateToken from "../middleware/validateTokenHandler";
import isAdmin from "../middleware/isAdminHandler";

const router = express.Router();

router.route("/").get(getSubcategories).post(validateToken, isAdmin, createSubcategory);
router
    .route("/:id")
    .get(getSubcategory)
    .put(validateToken, isAdmin, updateSubcategory)
    .delete(validateToken, isAdmin, deleteSubcategory);

export default router;
