import express from "express";
import users from "../controllers/authController";
import checkAuth from "../middleware/check_auth";
import userValidation from "../middleware/userValidation";
const router = express.Router();

router.get("/", users.getAllUsers);
router.get("/admin", checkAuth.user, users.getAllAdmins);
router.post(
  "/admin/register",
  checkAuth.user,
  checkAuth.admin,
  userValidation.create,
  users.registerAdminUser
);
router.post("/auth/signup", userValidation.create, users.signUp);
router.post("/auth/login", userValidation.login, users.login);
router.get("/:userId/orders", checkAuth.user, users.userOrderHistory);
router.get("/:userId", users.getUserById);
router.get("/admin/:userId", checkAuth.user, users.getUserById);
router.post("/logout", checkAuth.user, users.signOut);
router.put("/:userId", checkAuth.user, userValidation.update, users.updateUser);
router.delete("/:user_id", checkAuth.user, users.deleteUser);

export default router;
