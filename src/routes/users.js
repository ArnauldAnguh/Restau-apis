import express from "express";
import users from "../controllers/authController";
import checkAuth from "../middleware/check_auth";
const router = express.Router();

router.get("/", checkAuth.user, checkAuth.admin, users.getAllUsers);
router.get("/admin", checkAuth.admin, users.getAllAdmins);
router.post("/admin", checkAuth.admin, users.registerAdminUser);
router.post("/login", checkAuth.user, checkAuth.admin, users.login);
router.post("/signup", checkAuth.user, checkAuth.admin, users.signUp);
router.get("/:userId", users.getUserById);
router.patch("/:userId", checkAuth.user, users.updateUser);
router.delete(
  "/:user_id",
  checkAuth.user,
  checkAuth.admin,
  users.deleteUser
);

export default router;
