import { Response } from "express";
import getUserId from "../middleware/getUserIdHandler";
import User from "../models/usersModel";
import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import webpush from "web-push";
import { Types } from "mongoose";

export const savePushSubscription = async (req: AuthorizedRequest, res: Response) => {
    try {
        const user = await getUserId(req);
        const subscription = req.body;
        if (!user) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }

        await User.findByIdAndUpdate(user, {
            pushSubscription: subscription
        });

        res.status(200).json({ message: "Subscription saved" });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export const sendStatusNotification = async (userId: Types.ObjectId, newStatus: string) => {
    const user = await User.findById(userId);
    const subscription = user?.pushSubscription;

    if (!subscription) return;

    const payload = JSON.stringify({
        title: "Order status",
        body: `Your order status has been changed to: ${newStatus}`
    });

    try {
        await webpush.sendNotification(subscription, payload);
    } catch (err) {
        console.error("Błąd wysyłania powiadomienia push", err);
    }
};
