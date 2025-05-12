import express from "express";
import { registerUser, loginUser, getUserInfo } from "../controllers/authController";
import validateToken from "../middleware/validateTokenHandler";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", validateToken, getUserInfo);

export default router;

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user in the system by providing email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (invalid data)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login an existing user
 *     description: Login a user by providing email and password to receive a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User logged in successfully, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token
 *       401:
 *         description: Unauthorized (invalid credentials)
 *       400:
 *         description: Bad request (invalid data)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get user information
 *     description: Get the information of the logged-in user, requires a valid JWT token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized (invalid or missing JWT token)
 *       500:
 *         description: Internal server error
 */
