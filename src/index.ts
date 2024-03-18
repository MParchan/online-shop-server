import express, { Application } from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/dbConnection";
import categoryRoutes from "./routes/categoriesRoutes";

dotenv.config();
connectDb();

const app: Application = express();
const port = process.env.PORT || 5002;

app.use(express.json());
app.use("/api/categories", categoryRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});