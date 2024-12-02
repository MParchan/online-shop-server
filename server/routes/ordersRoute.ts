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
