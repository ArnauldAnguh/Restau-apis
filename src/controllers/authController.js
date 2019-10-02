import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";

function createToken(user) {
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1h"
    }
  );

  return token;
}

export default {
  async login(req, res) {
    const { email, password } = req.body;
    let user;
    try {
      const rows = await User.find({ email });
      [user] = rows;
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!user) {
      return res.status(400).json({ errors: "Wrong user credentials" });
    }
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        const token = createToken(user);
        return res
          .status(200)
          .send({ data: { token, user }, message: "Sign in successful" });
      }
    }
    return res.status(400).json({ errors: "Auth Failed!" });
  },

  async signUp(req, res) {
    const user = new User(req.body);
    user.password = bcrypt.hashSync(req.body.password, 10);
    let newUser;
    try {
      newUser = await user.save();
      console.log("NEW USER:", newUser);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
    const token = createToken(newUser);
    return res
      .status(200)
      .json({ data: { token, user: newUser }, message: "Signup successful!" });
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

  async updateUser(req, res) {
    const user_id = parseInt(req.params.userId, 10);
    if (!user_id || Number.isNaN(user_id)) {
      return res.status(400).send({ errors: "A valid user Id is required" });
    }

    let user;
    try {
      user = await User.findById(user_id);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!user) {
      return res.status(200).send({ msg: "User not found" });
    }
    // REMEMBER TO FIX THIS/(compare the logged in user id with the updating user id)
    if (req.body.password !== user.password) {
      return res.status(400).send({ errorsMsg: "passwords do not match" });
    }

    user.name = req.body.name;
    user.email = req.body.email;
    user.role = req.body.role ? req.body.role : "user";
    user.password = req.body.password;

    let updatedUser;
    try {
      updatedUser = await user.update();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    return res
      .status(200)
      .json({ data: updatedUser, message: "User successfully updated" });
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
