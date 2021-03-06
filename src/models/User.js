import db from "../db";
export default class User {
  constructor(user) {
    if (!user) {
      throw new Error("User details required");
    }
    if (user.id) {
      this.id = user.id;
    }
    this.role = user.role ? user.role : "user";
    this.username = user.username ? user.username : null;
    this.email = user.email ? user.email : null;
    this.password = user.password ? user.password : null;
    if (user.created_at) {
      this.created_at = user.created_at;
    }
    if (user.updated_at || user.updated_at == null) {
      this.updated_at = user.updated_at;
    }
  }

  async save() {
    const params = [this.role, this.username, this.email, this.password];
    try {
      const { rows } = await db.query(
        `INSERT INTO users (role, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
        params
      );
      const newUser = new User(rows[0]);
      return newUser;
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  async update() {
    const params = [
      this.role,
      this.username,
      this.email,
      this.password,
      this.id
    ];
    try {
      const { rows } = await db.query(
        `UPDATE users SET 
                            role=$1, 
                            username=$2, 
                            email=$3, 
                            updated_at=NOW(), 
                            password=$4
                    WHERE id=$5 RETURNING *`,
        params
      );
      const user = new User(rows[0]);
      return user;
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  static async signOutToken(token) {
    try {
      const result = await db.query(
        "INSERT INTO token_signed_out (token) VALUES ($1) RETURNING *",
        [token]
      );
      return result.rows[0];
    } catch (error) {
      return error;
    }
  }
  static async find({}) {
    let queryString = "SELECT * FROM users WHERE role = 'user' ";
    try {
      const { rows } = await db.query(queryString);
      return rows;
    } catch (e) {
      return e;
    }
  }
  static async findByEmail(email) {
    let queryString = "SELECT * FROM users WHERE email = $1 LIMIT 1";
    try {
      const { rows } = await db.query(queryString, [email]);
      return rows;
    } catch (e) {
      return e;
    }
  }
  static async findAdmin({}) {
    let queryString = "SELECT * FROM users WHERE role = 'admin'";
    try {
      const { rows } = await db.query(queryString);
      return rows;
    } catch (e) {
      return e;
    }
  }

  static async findOne({}) {
    let queryString = "";
    try {
      const { rows } = await db.query(queryString);
      const user = new User(rows[0]);
      return user;
    } catch (e) {
      return e;
    }
  }

  static async findById(userId) {
    try {
      const { rows } = await db.query(
        "SELECT * FROM users WHERE id=$1 AND role='user' LIMIT 1",
        [userId]
      );
      return rows[0];
    } catch (error) {
      return error;
    }
  }

  static async delete(userId) {
    try {
      const result = await db.query("DELETE FROM users WHERE id=$1", [userId]);
      return result;
    } catch (error) {
      return error;
    }
  }
}
