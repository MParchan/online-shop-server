import express, { Application } from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/dbConnection";
import categoriesRoutes from "./routes/categoriesRoute";
import subcategoriesRoutes from "./routes/subcategoriesRoute";

dotenv.config();
connectDb();

const app: Application = express();
const port: number = Number(process.env.PORT) || 5002;

app.use(express.json());
app.use("/api/categories", categoriesRoutes);
app.use("/api/subcategories", subcategoriesRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});