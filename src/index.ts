import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/dbConnection.js";
import categoryRoutes from "./routes/categoriesRoutes.js";

dotenv.config();
connectDb();

const app: Express = express();
const port = process.env.PORT || 5002;

app.use(express.json());
app.use("/api/categories", categoryRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});