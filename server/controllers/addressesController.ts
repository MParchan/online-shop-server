import { Response } from "express";
import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import getUserId from "../middleware/getUserIdHandler";
import Address from "../models/addressesModel";
import { IAddress } from "../types/mongodb/address.interface";

//@desc Get all user addresses
//@route GET /api/<API_VERSION>/addresses
//@access private
const getAddresses = async (req: AuthorizedRequest, res: Response) => {
    try {
        const user = await getUserId(req);
        if (!user) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }

        const addresses = await Address.find({ user: user });
        res.status(200).json(addresses);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Create new address
//@route POST /api/<API_VERSION>/addresses
//@access private
const createAddress = async (req: AuthorizedRequest, res: Response) => {
    try {
        const user = await getUserId(req);
        if (!user) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }
        const address: IAddress = req.body;
        address.user = user;
        const createdAddress = await Address.create(address);
        res.status(201).json(createdAddress);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Get address
//@route GET /api/<API_VERSION>/address/:id
//@access private
const getAddress = async (req: AuthorizedRequest, res: Response) => {
    try {
        const id: string = req.params.id;
        const user = await getUserId(req);
        if (!user) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }

        const address = await Address.findById(id);
        if (!address) {
            res.status(404).json({ message: "Address not found" });
            return;
        }
        if (address.user !== user) {
            res.status(403).json({ message: "You do not have access to this resource" });
            return;
        }
        res.status(200).json(address);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Update address
//@route PUT /api/<API_VERSION>/addresses/:id
//@access private
const updateAddress = async (req: AuthorizedRequest, res: Response) => {
    try {
        const user = await getUserId(req);
        if (!user) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }
        const id: string = req.params.id;
        const address: IAddress = req.body;
        address.user = user;

        const existingAddress = await Address.findById(id);
        if (!existingAddress) {
            res.status(404).json({ message: "Address not found" });
            return;
        }
        if (existingAddress.user !== user) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }
        const updatedAddress = await Address.findByIdAndUpdate(id, address, { new: true, runValidators: true });
        res.status(200).json(updatedAddress);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Delete address
//@route DELETE /api/<API_VERSION>/addresses/:id
//@access private
const deleteAddress = async (req: AuthorizedRequest, res: Response) => {
    try {
        const user = await getUserId(req);
        if (!user) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }
        const id: string = req.params.id;

        const address = await Address.findById(id);
        if (!address) {
            res.status(404).json({ message: "Address not found" });
            return;
        }
        if (address.user !== user) {
            res.status(401).json({ message: "User not authorized" });
            return;
        }
        await address.deleteOne();

        res.status(204).json();
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getAddresses, createAddress, getAddress, updateAddress, deleteAddress };
