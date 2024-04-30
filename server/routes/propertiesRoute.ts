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

const router = express.Router();

router.route("/").get(getProperties).post(validateToken, isAdmin, createProperty);
router
    .route("/:id")
    .get(getProperty)
    .put(validateToken, isAdmin, updateProperty)
    .delete(validateToken, isAdmin, deleteProperty);

export default router;
