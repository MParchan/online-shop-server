import express from "express";
import { getRoles, createRole, getRole, updateRole, deleteRole } from "../controllers/rolesController";

const router = express.Router();

router.route("/").get(getRoles).post(createRole);

router.route("/:id").get(getRole).put(updateRole).delete(deleteRole);

export default router;
