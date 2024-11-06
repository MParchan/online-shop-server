import express from "express";
import validateToken from "../middleware/validateTokenHandler";
import validateId from "../middleware/validateIdHandler";
import {
    createAddress,
    deleteAddress,
    getAddress,
    getAddresses,
    updateAddress
} from "../controllers/addressesController";

const router = express.Router();

router.route("/").get(validateToken, getAddresses).post(validateToken, createAddress);
router
    .route("/:id")
    .get(validateId, validateToken, getAddress)
    .put(validateId, validateToken, updateAddress)
    .delete(validateId, validateToken, deleteAddress);

export default router;
