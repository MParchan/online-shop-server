import express from "express";
import validateToken from "../middleware/validateTokenHandler";
import {
    getOpinions,
    createOpinion,
    getOpinion,
    updateOpinion,
    deleteOpinion
} from "../controllers/opinionsController";

const router = express.Router();

router.route("/").get(getOpinions).post(validateToken, createOpinion);
router.route("/:id").get(getOpinion).put(validateToken, updateOpinion).delete(validateToken, deleteOpinion);

export default router;
