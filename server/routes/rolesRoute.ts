import express from "express";
import { getRoles, createRole, getRole, updateRole, deleteRole } from "../controllers/rolesController";
import validateToken from "../middleware/validateTokenHandler";
import isAdmin from "../middleware/isAdminHandler";

const router = express.Router();

router.route("/").get(validateToken, isAdmin, getRoles).post(validateToken, isAdmin, createRole);
router
    .route("/:id")
    .get(validateToken, isAdmin, getRole)
    .put(validateToken, isAdmin, updateRole)
    .delete(validateToken, isAdmin, deleteRole);

export default router;
