import { Pool } from "pg";
import "core-js/shim";
import { config } from "dotenv";

config();
let connectionString;
if (process.env.NODE_ENV === "test") {
  connectionString = process.env.TEST_DB_URL;
} else {
  connectionString = process.env.DEV_DB_URL;
}
const pool = new Pool({
  connectionString
});

export default {
  async query(text, params) {
    try {
      const result = await pool.query(text, params);
      return result;
    } catch (e) {
      throw new Error(e);
    }
  }
};
