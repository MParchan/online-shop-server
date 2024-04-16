import express from "express";
import { getRoles, createRole, getRole, updateRole, deleteRole } from "../controllers/rolesController";
import validateToken from "../middleware/validateTokenHandler";

const router = express.Router();

router.route("/").get(validateToken, getRoles).post(validateToken, createRole);
router.route("/:id").get(validateToken, getRole).put(validateToken, updateRole).delete(validateToken, deleteRole);

export default router;
