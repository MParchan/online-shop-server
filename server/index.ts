import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./config/dbConnection";
import authRoute from "./routes/authRoute";
import rolesRoute from "./routes/rolesRoute";
import categoriesRoutes from "./routes/categoriesRoute";
import subcategoriesRoutes from "./routes/subcategoriesRoute";
import brandsRoute from "./routes/brandsRoute";
import propertyTypesRoute from "./routes/propertyTypesRoute";
import propertiesRoute from "./routes/propertiesRoute";
import productsRoute from "./routes/productsRoute";
import opinionsRoute from "./routes/opinionsRoute";
import ordersRoute from "./routes/ordersRoute";

dotenv.config();
connectDb();

const app: Application = express();
const port: number = Number(process.env.PORT) || 5002;
const apiVersion: string = "v1";

const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(`/api/${apiVersion}/auth`, authRoute);
app.use(`/api/${apiVersion}/roles`, rolesRoute);
app.use(`/api/${apiVersion}/categories`, categoriesRoutes);
app.use(`/api/${apiVersion}/subcategories`, subcategoriesRoutes);
app.use(`/api/${apiVersion}/brands`, brandsRoute);
app.use(`/api/${apiVersion}/property-types`, propertyTypesRoute);
app.use(`/api/${apiVersion}/properties`, propertiesRoute);
app.use(`/api/${apiVersion}/products`, productsRoute);
app.use(`/api/${apiVersion}/opinions`, opinionsRoute);
app.use(`/api/${apiVersion}/orders`, ordersRoute);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
