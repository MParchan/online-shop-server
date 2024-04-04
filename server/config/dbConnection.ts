import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const connectionString: string = process.env.CONNECTION_STRING || "";
        const connect = await mongoose.connect(connectionString);
        console.log("Database connected: ", connect.connection.host, connect.connection.name);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};