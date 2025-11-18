import { Document, Types } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    role: Types.ObjectId;
    webPush?: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    };
    expoPushToken: string;
    fcmToken: string;
    addresses: Types.ObjectId[];
    opinions: Types.ObjectId[];
    orders: Types.ObjectId[];
}
