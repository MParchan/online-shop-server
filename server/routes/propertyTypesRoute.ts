import express from "express";
import validateToken from "../middleware/validateTokenHandler";
import {
    getPropertyTypes,
    createPropertyType,
    getPropertyType,
    updatePropertyType,
    deletePropertyType
} from "../controllers/propertyTypesController";

const router = express.Router();

router.route("/").get(getPropertyTypes).post(validateToken, createPropertyType);
router
    .route("/:id")
    .get(getPropertyType)
    .put(validateToken, updatePropertyType)
    .delete(validateToken, deletePropertyType);

export default router;
