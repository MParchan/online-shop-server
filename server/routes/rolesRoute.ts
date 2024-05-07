import express from "express";
import { getRoles, createRole, getRole, updateRole, deleteRole } from "../controllers/rolesController";
import validateToken from "../middleware/validateTokenHandler";
import isAdmin from "../middleware/isAdminHandler";
import validateId from "../middleware/validateIdHandler";

const router = express.Router();

router.route("/").get(validateToken, isAdmin, getRoles).post(validateToken, isAdmin, createRole);
router
    .route("/:id")
    .get(validateId, validateToken, isAdmin, getRole)
    .put(validateId, validateToken, isAdmin, updateRole)
    .delete(validateId, validateToken, isAdmin, deleteRole);

export default router;
