import express from "express";
import users from "../controllers/authController";
import checkAuth from "../middleware/check_auth";
import userValidation from "../middleware/userValidation";
const router = express.Router();

router.get("/", users.getAllUsers);
router.get("/admin", checkAuth.admin, checkAuth.admin, users.getAllAdmins);
router.post("/admin", checkAuth.admin, users.registerAdminUser);
router.post("/login", userValidation.login, users.login);
router.post("/logout", checkAuth.user, users.signOut);
router.get("/history/:user_id", checkAuth.user, users.userOrderHistory);
router.post("/signup", userValidation.create, users.signUp);
router.get("/:userId", users.getUserById);
router.put("/:userId", checkAuth.user, users.updateUser);
router.delete("/:user_id", checkAuth.user, checkAuth.admin, users.deleteUser);

export default router;
