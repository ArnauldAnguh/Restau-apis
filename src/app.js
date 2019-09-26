import express from "express";
import "babel-polyfill";
import db from "./db";
import morgan from "morgan";
import foodItemsRoutes from "./routes/foodItems";
import orderRoutes from "./routes/orders";
const app = express();
app.use(morgan("dev"));
//Routes which should handle requests
app.use("/orders", orderRoutes);
app.use("/foodItems", foodItemsRoutes);

export default app;
