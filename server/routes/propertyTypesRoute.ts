import express from "express";
import validateToken from "../middleware/validateTokenHandler";
import {
    getPropertyTypes,
    createPropertyType,
    getPropertyType,
    updatePropertyType,
    deletePropertyType
} from "../controllers/propertyTypesController";
import isAdmin from "../middleware/isAdminHandler";

const router = express.Router();

router.route("/").get(getPropertyTypes).post(validateToken, isAdmin, createPropertyType);
router
    .route("/:id")
    .get(getPropertyType)
    .put(validateToken, isAdmin, updatePropertyType)
    .delete(validateToken, isAdmin, deletePropertyType);

export default router;
