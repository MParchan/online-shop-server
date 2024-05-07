import express from "express";
import validateToken from "../middleware/validateTokenHandler";
import isAdmin from "../middleware/isAdminHandler";
import {
    getProperties,
    createProperty,
    getProperty,
    updateProperty,
    deleteProperty
} from "../controllers/propertyController";
import validateId from "../middleware/validateIdHandler";

const router = express.Router();

router.route("/").get(getProperties).post(validateToken, isAdmin, createProperty);
router
    .route("/:id")
    .get(validateId, getProperty)
    .put(validateId, validateToken, isAdmin, updateProperty)
    .delete(validateId, validateToken, isAdmin, deleteProperty);

export default router;
