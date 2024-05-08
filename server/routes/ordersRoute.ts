import express from "express";
import validateToken from "../middleware/validateTokenHandler";
import validateId from "../middleware/validateIdHandler";
import { getOrders, createOrder, getOrder } from "../controllers/ordersController";

const router = express.Router();

router.route("/").get(validateToken, getOrders).post(validateToken, createOrder);
router.route("/:id").get(validateId, validateToken, getOrder);

export default router;
