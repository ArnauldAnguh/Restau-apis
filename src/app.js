import express from "express";
import bodyParser from "body-parser";
import "core-js/shim";
import "regenerator-runtime/runtime";
import morgan from "morgan";
import path from "path";

const app = express();

import userRoutes from "./routes/users";
import foodItemsRoutes from "./routes/foodItems";
import orderRoutes from "./routes/orders";

app.use(express.static(path.resolve("./public")));

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//CORS Error Handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    res.status(200).json({});
  }
  next();
});

//Routes which should handle requests
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/foodItems", foodItemsRoutes);
app.get("*", (req, res) => {
  res
    .status(403)
    .json({ msg: "Invalid API endpoint, please visit '/api/v1/index' " });
});

//Error Listening middleware
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message
  });
});

export default app;
