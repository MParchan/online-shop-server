import express, { Application } from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/dbConnection";
import authRoute from "./routes/authRoute";
import rolesRoute from "./routes/rolesRoute";
import categoriesRoutes from "./routes/categoriesRoute";
import subcategoriesRoutes from "./routes/subcategoriesRoute";
import brandsRoute from "./routes/brandsRoute";

dotenv.config();
connectDb();

const app: Application = express();
const port: number = Number(process.env.PORT) || 5002;
const apiVersion: string = "v1";

app.use(express.json());
app.use(`/api/${apiVersion}/auth`, authRoute);
app.use(`/api/${apiVersion}/roles`, rolesRoute);
app.use(`/api/${apiVersion}/categories`, categoriesRoutes);
app.use(`/api/${apiVersion}/subcategories`, subcategoriesRoutes);
app.use(`/api/${apiVersion}/brands`, brandsRoute);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
