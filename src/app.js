import express from "express";
import "babel-polyfill";
import db from "./db";
const app = express();

app.use(async (req, res, next) => {
  const rows = await db.query("SELECT * FROM users");
  res.status(201).json(rows.rows[0]);
});

export default app;
