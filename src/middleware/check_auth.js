import jwt from "jsonwebtoken";
import User from "../models/User";
export default {
  async user(req, res, next) {
    if (
      typeof req.headers.authorization !== "string" ||
      req.headers.authorization === ""
    ) {
      return res
        .status(400)
        .json({ error: "User Verification Token is required" });
    }
    try {
      const token = req.headers["authorization"].split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      req.user = await User.findById(decoded.id);
      next();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  },
  async admin(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        return res.status(401).json({ error: "Unauthorized" });
      }
      return next();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }
};
