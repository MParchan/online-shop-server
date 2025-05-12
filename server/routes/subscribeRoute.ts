import express from "express";
import validateToken from "../middleware/validateTokenHandler";
import { savePushSubscription } from "../controllers/subscribeController";

const router = express.Router();
router.route("/push").post(validateToken, savePushSubscription);

export default router;
