import { Pool, Client } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../index";
import { firstUser } from "../../tests/data/users";
import { config } from "dotenv";

config();
let connectionString = "";
if (process.env.NODE_ENV === "test") {
  connectionString = process.env.TEST_DB_URL;
} else {
  connectionString = process.env.DEV_DB_URL;
}

const pool = new Pool({
  connectionString
});

const client = new Client({
  connectionString
});
client.connect();

export const createToken = user => {
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
    },
    process.env.JWT_SECRET
  );
  return token;
};

export const initUsers = async () => {
  const passwordHash = bcrypt.hashSync(firstUser.password, 10);
  const params = [
    firstUser.role,
    firstUser.username,
    firstUser.email,
    passwordHash
  ];
  try {
    await db.query(
      `INSERT INTO users (role, username, email, password)
      VALUES ($1, $2, $3, $4)`,
      params
    );
  } catch (error) {
    return error;
  }
};

export const createUser = async user => {
  const passwordHash = bcrypt.hashSync(user.password, 10);
  const params = [user.role, user.username, user.email, passwordHash];

  try {
    const { rows } = await db.query(
      `INSERT INTO users (role, username, email, password)
      VALUES ($1, $2, $3, $4) RETURNING *`,
      params
    );
    const token = rows[0];
    return token;
  } catch (error) {
    return error;
  }
};

export const deleteUsers = async () => {
  try {
    const result = await db.query("DELETE FROM users");
    return result;
  } catch (error) {
    return error;
  }
};

export const deleteFoodItems = async () => {
  try {
    const result = await db.query("DELETE FROM food_items");
    return result;
  } catch (error) {
    return error;
  }
};

export const initFoodItems = async () => {
  const params = [
    firstItem.name,
    firstItem.image,
    firstItem.description,
    firstItem.quantity,
    firstItem.unit_price
  ];
  try {
    await db.query(
      `INSERT INTO food_items (name, image, description, quantity, unit_price)
    VALUES ($1, $2, $3, $4, $5)`,
      params
    );
  } catch (error) {
    return error;
  }
};

export const initOrders = async () => {
  const params = [
    firstOrder.customer_id,
    firstOrder.total_price,
    firstOrder.status
  ];

  try {
    await db.query(
      `INSERT INTO orders (customer_id, total_price, status)
    VALUES ($1, $2, $3)`,
      params
    );
  } catch (error) {
    return error;
  }
};

client.end();
