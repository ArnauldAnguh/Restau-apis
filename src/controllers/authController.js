import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";
import Order from "../models/Orders";

function createToken(user) {
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.username,
      email: user.email
    },
    process.env.JWT_KEY,
    {
      expiresIn: "10h"
    }
  );

  return token;
}

export default {
  async login(req, res) {
    const { email, password } = req.body;
    let user;
    try {
      const rows = await User.findByEmail(email);
      [user] = rows;
      if (!user) {
        return res.status(400).json({ errors: "Wrong user credentials" });
      }

      if (user) {
        delete user.password;
        const token = createToken(user);
         return res
          .status(200)
          .send({ data: { token, user }, message: "Sign in successful" });
      }
      return res.status(400).json({ errors: "Auth Failed!" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  },

  async signUp(req, res) {
    try {
      const user = new User(req.body);
      user.password = bcrypt.hashSync(user.password, 10);
      const newUser = await user.save();
      const token = createToken(newUser);
      return res.status(200).json({
        data: { token, user: newUser },
        message: "Signup Successfull!"
      });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  },

  async getAllUsers(req, res) {
    let users;
    try {
      users = await User.find({});
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!users.length) {
      return res.status(200).send({ data: [], message: "No users yet" });
    }
    return res.status(200).json({ data: users, message: "success" });
  },
  async getAllAdmins(req, res) {
    let admins;
    try {
      admins = await User.findAdmin({});
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!admins.length) {
      return res.status(200).send({ data: [], message: "No admin users yet" });
    }
    return res
      .status(200)
      .json({ data: admins, successMsg: "All Admin Users" });
  },

  async getUserById(req, res) {
    const user_id = parseInt(req.params.userId, 10);
    if (!user_id || Number.isNaN(user_id)) {
      return res.status(400).send({ errors: "A valid user Id is required" });
    }
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(200).send({ message: "User not found" });
    }

    return res.status(200).json({ data: user, message: "success" });
  },

  async userOrderHistory(req, res) {
    let user_id;
    let user;
    try {
      if (req.user.id && req.user.role === "admin") {
        user_id = parseInt(req.params.user_id, 10);
      } else if (req.user.id && req.user.role === "user") {
        user_id = parseInt(req.user.id, 10);
      }
      if (!Number.isInteger(user_id)) {
        return res.status(400).send({ errors: "A valid user Id is required" });
      } else {
        user = await User.findById(user_id);
        if (req.user.id === user.id || req.user.role === "admin") {
          let orders;
          orders = await Order.getOrderHistory(user_id);
          console.log("USER FOUND", orders);
          return res.status(200).json({ OrderHistory: orders });
        } else {
          return res.status(403).send({ error: "Unauthorized!" });
        }
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async registerAdminUser(req, res) {
    const user = new User(req.body);
    user.password = bcrypt.hashSync(req.body.password, 10);
    user.role = "admin";
    let newUser;
    try {
      newUser = await user.save();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
    return res
      .status(201)
      .json({ data: newUser, message: "Admin user created" });
  },

  async signOut(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const results = await User.signOutToken(token);
      res.status(200).json({ results, message: "Successfully signed Out!" });
    } catch (e) {
      return e;
    }
  },

  async updateUser(req, res) {
    const user_id = parseInt(req.params.userId, 10);
    if (!Number.isInteger(user_id)) {
      return res.status(400).send({ errors: "A valid user Id is required" });
    }
    let user;
    try {
      user = await User.findById(user_id);
      if (!user) {
        return res.status(200).send({ errors: "User not found" });
      }

      user.username = req.body.username ? req.body.username : user.name;
      user.email = req.body.email ? req.body.email : user.email;
      user.role = req.body.role ? req.body.role : user.role;
      user.password = req.body.password
        ? bcrypt.hashSync(req.body.password, 10)
        : user.password;
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400).send({ errors: "Invalid Old Password" });
      }
      let updatedUser;
      const userData = new User(user);
      updatedUser = await userData.update();

      return res
        .status(200)
        .json({ data: updatedUser, message: "User successfully updated" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async deleteUser(req, res) {
    const user_id = parseInt(req.params.user_id, 10);
    if (!user_id || Number.isNaN(user_id)) {
      return res.status(400).send({ errors: "Invalid user id" });
    }
    await User.delete(user_id);

    return res.status(200).json({ message: "User deleted successfully" });
  }
};
