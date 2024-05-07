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
import validateId from "../middleware/validateIdHandler";

const router = express.Router();

router.route("/").get(getPropertyTypes).post(validateToken, isAdmin, createPropertyType);
router
    .route("/:id")
    .get(validateId, getPropertyType)
    .put(validateId, validateToken, isAdmin, updatePropertyType)
    .delete(validateId, validateToken, isAdmin, deletePropertyType);

export default router;
