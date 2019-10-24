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
      if (bcrypt.compareSync(password, user.password)) {
        delete user.password;
        const token = createToken(user);
        return res
          .status(200)
          .json({ data: { token, user }, message: "Sign in successful" });
      }
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  async signUp(req, res) {
    try {
      const user = new User(req.body);
      user.password = bcrypt.hashSync(user.password, 10);
      let newUser = await user.save();
      delete newUser.password;
      const token = createToken(newUser);
      return res.status(201).json({
        data: { token, user: newUser },
        message: "Signup Successful!"
      });
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  },
  async registerAdminUser(req, res) {
    const user = new User(req.body);
    let newUser;
    try {
      user.password = bcrypt.hashSync(user.password, 10);
      user.role = "admin";
      newUser = await user.save();
      delete newUser.password;
      return res
        .status(201)
        .json({ data: newUser, message: "Admin user created" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  },
  async getAllUsers(req, res) {
    let users;
    try {
      users = await User.find({});
      users.forEach(user => {
        delete user.password;
      });
      if (!users.length) {
        return res.status(200).json({ data: [], message: "No users yet" });
      }
      return res.status(200).json({ data: users, message: "success" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async getAllAdmins(req, res) {
    let admins;
    try {
      admins = await User.findAdmin({});
      admins.forEach(admin => {
        delete admin.password;
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!admins.length) {
      return res.status(200).json({ data: [], message: "No admin users yet" });
    }
    return res
      .status(200)
      .json({ data: admins, successMsg: "All Admin Users" });
  },

  async getUserById(req, res) {
    const user_id = parseInt(req.params.userId, 10);
    try {
      if (Number.isNaN(user_id)) {
        return res.status(400).json({ errors: "A valid user Id is required" });
      }
      const user = await User.findById(user_id);

      if (!user) {
        return res.status(200).json({ message: "User not found" });
      }
      delete user.password;
      return res.status(200).json({ data: user, message: "success" });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
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
        return res.status(400).json({ errors: "A valid user Id is required" });
      } else {
        user = await User.findById(user_id);
        if (req.user.id === user.id || req.user.role === "admin") {
          let orders;
          orders = await Order.getOrderHistory(user_id);
          return res.status(200).json({ OrderHistory: orders });
        } else {
          return res.status(401).json({ error: "Unauthorized!" });
        }
      }
    } catch (error) {
      return error;
    }
  },

  async signOut(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const results = await User.signOutToken(token);
      res.status(200).json({ results, message: "You are now logged out" });
    } catch (e) {
      return e;
    }
  },

  async updateUser(req, res) {
    const user_id = parseInt(req.params.userId, 10);
    if (!Number.isInteger(user_id)) {
      return res.status(400).json({ errors: "A valid user Id is required" });
    }
    let user;
    try {
      user = await User.findById(user_id);
      if (!user) {
        return res.status(200).json({ errors: "User not found" });
      }
      if (!bcrypt.compareSync(req.body.passwordOld, user.password)) {
        return res.status(400).json({ errors: "Old password does not match" });
      }
      user.username = req.body.username ? req.body.username : user.name;
      user.email = req.body.email ? req.body.email : user.email;
      user.role = req.body.role ? req.body.role : user.role;
      user.password = req.body.password
        ? bcrypt.hashSync(req.body.password, 10)
        : user.password;

      let updatedUser;
      const userData = new User(user);

      updatedUser = await userData.update();
      delete updatedUser.password;
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
      return res.status(400).json({ errors: "Invalid user id" });
    }
    await User.delete(user_id);

    return res.status(204).json({ message: "User deleted successfully" });
  }
};
