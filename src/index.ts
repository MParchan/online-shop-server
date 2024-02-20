import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/dbConnection.js";

dotenv.config();
connectDb();

const app: Express = express();
const port = process.env.PORT || 5002;

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});