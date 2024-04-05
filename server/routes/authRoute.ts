import express from "express";
import { registerUser, loginUser, getCurrentUser } from "../controllers/authController";
import validateToken from "../middleware/validateTokenHandler";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", validateToken, getCurrentUser);

export default router;
