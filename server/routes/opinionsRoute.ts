import express from "express";
import validateToken from "../middleware/validateTokenHandler";
import {
    getOpinions,
    createOpinion,
    getOpinion,
    updateOpinion,
    deleteOpinion
} from "../controllers/opinionsController";
import validateId from "../middleware/validateIdHandler";

const router = express.Router();

router.route("/").get(validateToken, getOpinions).post(validateToken, createOpinion);
router
    .route("/:id")
    .get(validateId, getOpinion)
    .put(validateId, validateToken, updateOpinion)
    .delete(validateId, validateToken, deleteOpinion);

export default router;
