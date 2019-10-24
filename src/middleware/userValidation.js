import validator from "validator";
import User from "../models/User";

export default {
  login: (req, res, next) => {
    let user = req.body;
    user.username = validator.trim(user.username);
    user.email = validator.trim(user.email);
    if (!user.username || validator.isEmpty(user.username)) {
      return res.status(400).json({ error: "Username is required" });
    }
    if (!user.password || validator.isEmpty(user.password)) {
      return res.status(400).json({ error: "Password is required" });
    }
    next();
  },

  create: async (req, res, next) => {
    let user = req.body;
    user.username = validator.trim(user.username);
    user.email = validator.trim(user.email);
    let validatedUser;
    const email = user.email;
    validatedUser = await User.findByEmail(email);
    try {
      if (user.username && !validator.isAlphanumeric(user.username)) {
        return res.status(400).json({
          error: "Username should contain only characters and/or numbers"
        });
      }
      if (
        user.username &&
        !validator.isLength(user.username, { min: 3, max: 20 })
      ) {
        return res
          .status(400)
          .json({ error: "Username must have between 3 to 100 characters" });
      }
      if (!user.email || validator.isEmpty(user.email)) {
        return res.status(400).json({ error: "Email is required" });
      }
      if (user.email && !validator.isEmail(user.email)) {
        return res.status(400).json({ error: "Email address is not valid!!" });
      }
      if (!user.password || validator.isEmpty(user.password)) {
        return res.status(400).json({ error: "Password is required" });
      }
      if (user.password !== user.passwordConf) {
        return res
          .status(400)
          .json({ error: "The two passwords do not match" });
      }
      if (user.password.length < 6 || validator.isAlpha(user.password)) {
        return res.status(400).json({
          error:
            "Password must be at least 6 characters and contain at least a number"
        });
      }
      if (validatedUser.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
      }
      next();
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  },

  async update(req, res, next) {
    let user = req.body;
    try {
      user.username = validator.trim(user.username);
      user.email = validator.trim(user.email);
      let validatedUser = await User.findByEmail(user.email);
      if (validatedUser.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
      }
      if (user.email && !validator.isEmail(user.email)) {
        return res.status(400).json({ error: "Email address is not valid!!" });
      }
      if (!user.passwordOld || validator.isEmpty(user.passwordOld)) {
        return res.status(400).json({ error: "Old password is required" });
      }

      if (user.username && !validator.isAlphanumeric(user.username)) {
        return res.status(400).json({
          error: "Username should contain only characters and/or numbers"
        });
      }
      if (
        user.username &&
        !validator.isLength(user.username, { min: 3, max: 20 })
      ) {
        return res
          .status(400)
          .json({ error: "Username must have between 3 to 100 characters" });
      }
      next();
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }
};
