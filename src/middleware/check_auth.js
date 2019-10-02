import jwt from "jsonwebtoken";
export default {
  async user(req, res, next) {
    try {
      const token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];
      if (!token) {
        return res
          .status(403)
          .json({ error: "User Verification Token is required" });
      }
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      req.user = await User.findById(decoded.id);
      next();
    } catch (e) {
      return res.status(401).json({ msg: "Auth Failed" });
    }
  },
  async admin(req, res, next) {
    const { user } = req;
    console.log("USER", user);
    if (user.role !== "admin") {
      return res.status(401).send({ error: "Unauthorized" });
    }
    return next();
  }
};
