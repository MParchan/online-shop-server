import express from "express";
import validateToken from "../middleware/validateTokenHandler";
import validateId from "../middleware/validateIdHandler";
import { getOrders, createOrder, getOrder, changeOrderStatus } from "../controllers/ordersController";
import isAdmin from "../middleware/isAdminHandler";

const router = express.Router();

router.route("/").get(validateToken, getOrders).post(validateToken, createOrder);
router.route("/:id").get(validateId, validateToken, getOrder);
router.route("/:id/status").patch(validateId, validateToken, isAdmin, changeOrderStatus);

export default router;

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Change the status of an order
 *     description: This endpoint allows an admin to change the status of an order by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order to update the status for
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the order
 *                 enum:
 *                   - Accepted
 *                   - In preparation
 *                   - Shipped
 *                   - Delivered
 *                   - Cancelled
 *                 example: "Accepted"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully changed the status of the order
 *       400:
 *         description: Invalid input, such as invalid status or order ID
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       403:
 *         description: Forbidden, user is not an admin
 *       404:
 *         description: Order not found
 */
