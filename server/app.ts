import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import webpush from "web-push";
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
import addressesRoute from "./routes/addressesRoute";
import subscribeRoute from "./routes/subscribeRoute";
import helmet from "helmet";

dotenv.config();
connectDb();

const app: Application = express();
const apiVersion: string = "v1";

webpush.setVapidDetails("mailto:admin@admin.com", process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);
const whitelist = process.env.CORS_ORIGIN?.split(", ") || [];
const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Online shop server"
    });
});

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
app.use(`/api/${apiVersion}/addresses`, addressesRoute);
app.use(`/api/${apiVersion}/subscribe`, subscribeRoute);

export default app;
