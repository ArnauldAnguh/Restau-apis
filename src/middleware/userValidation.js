import User from "../models/User";
import validator from "validator";

function validateUser(user) {
  let errors = {};

  user.username = validator.trim(user.username);
  user.email = validator.trim(user.email);

  if (!user.username || validator.isEmpty(user.username)) {
    errors.username = "Username is required";
  }
  if (
    user.username &&
    !validator.isLength(user.username, { min: 3, max: 100 })
  ) {
    errors.username = "Username must have between 3 to 100 characters";
  }
  if (user.username && !validator.isAlphanumeric(user.username)) {
    errors.username = "Username should contain only characters and/or numbers";
  }
  if (user.username && !validator.isLowercase(user.username)) {
    errors.username = "Username must be all Lower Cased";
  }
  if (!user.email || validator.isEmpty(user.email)) {
    errors.email = "Email is required";
  }
  if (user.email && !validator.isEmail(user.email)) {
    errors.email = "Email address is not valid!!";
  }

  if (!user.password || validator.isEmpty(user.password)) {
    errors.password = "Password is required";
  }
  if (user.password.length < 6 || validator.isAlpha(user.password)) {
    errors.password =
      "Password must be at least 6 characters long and contain at least a number";
  }

  //   if (user.password !== user.password) {
  //     errors.password = "The two passwords do not match";
  //   }

  return errors;
}

export default {
  login(req, res, next) {
    const errors = {};
    const user = req.body;
    if (!user.email || validator.isEmpty(user.email)) {
      errors.email = "Email is required";
    }
    if (!user.password || validator.isEmpty(user.password)) {
      errors.password = "Password is required";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    next();
  },
  async create(req, res, next) {
    let user = req.body;
    let validatedUser;
    try {
      const errors = validateUser(user);
      const email = user.email;
      validatedUser = await User.findByEmail(email);
      if (validatedUser.length > 0) {
        errors.email = "Email already exists";
      }
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ error: errors });
      }
      next();
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  },

  update(req, res, next) {
    const user = req.body;
    const errors = validation(user);

    if (!user.password || validator.isEmpty(user.password)) {
      errors.password = "Old password is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    next();
  }
};
