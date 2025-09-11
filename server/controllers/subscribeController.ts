import { Response } from "express";
import getUserId from "../middleware/getUserIdHandler";
import User from "../models/usersModel";
import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import webpush from "web-push";
import { Types } from "mongoose";
import { fcm } from "../config/firebase";

type PushPayload = {
    title: string;
    body: string;
    data?: Record<string, string>;
};

type PushSubscriptionPayload = {
    webPush?: webpush.PushSubscription; // Web
    expoPushToken?: string; // Expo / React Native
    fcmToken?: string; // Flutter / Android/iOS
};

export const savePushSubscription = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userId = await getUserId(req);
        if (!userId) {
            return res.status(401).json({ message: "User is not authorized" });
        }

        const subscription: PushSubscriptionPayload = req.body;

        await User.findByIdAndUpdate(userId, {
            ...subscription
        });

        res.status(200).json({ message: "Subscription saved" });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export const sendStatusNotification = async (orderId: string, userId: Types.ObjectId, newStatus: string) => {
    const user = await User.findById(userId);

    if (!user) return;

    const payload = {
        title: "Order status",
        body: `Your order status has been changed to: ${newStatus}`,
        data: { url: `/orders/${orderId}` }
    };

    if (user.pushSubscription) {
        await sendWebPush(user.pushSubscription, payload);
    }

    if (user.expoPushToken) {
        await sendExpoPush(user.expoPushToken, payload);
    }

    if (user.fcmToken) {
        await sendFcmPush(user.fcmToken, payload);
    }
};

const sendWebPush = async (subscription: webpush.PushSubscription, payload: PushPayload) => {
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
    } catch (err) {
        console.error("Błąd Web Push:", err);
    }
};

const sendExpoPush = async (expoPushToken: string, payload: PushPayload) => {
    try {
        await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                to: expoPushToken,
                sound: "default",
                title: payload.title,
                body: payload.body,
                data: payload.data
            })
        });
    } catch (err) {
        console.error("Błąd Expo Push:", err);
    }
};

const sendFcmPush = async (fcmToken: string, payload: PushPayload) => {
    try {
        await fcm.send({
            token: fcmToken,
            notification: {
                title: payload.title,
                body: payload.body
            },
            data: payload.data || {}
        });
    } catch (err) {
        console.error("Błąd FCM Push:", err);
    }
};
