import express from "express";
import {
    getSubcategories,
    createSubcategory,
    getSubcategory,
    updateSubcategory,
    deleteSubcategory
} from "../controllers/subcategoriesController";
import validateToken from "../middleware/validateTokenHandler";
import isAdmin from "../middleware/isAdminHandler";
import validateId from "../middleware/validateIdHandler";

const router = express.Router();

router.route("/").get(getSubcategories).post(validateToken, isAdmin, createSubcategory);
router
    .route("/:id")
    .get(validateId, getSubcategory)
    .put(validateId, validateToken, isAdmin, updateSubcategory)
    .delete(validateId, validateToken, isAdmin, deleteSubcategory);

export default router;
