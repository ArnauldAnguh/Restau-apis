import express from "express";
import users from "../controllers/authController";
import checkAuth from "../middleware/check_auth";
const router = express.Router();

router.get("/", users.getAllUsers);
router.get("/admin", checkAuth.admin, checkAuth.admin, users.getAllAdmins);
router.post("/admin", checkAuth.admin, users.registerAdminUser);
router.post("/login", checkAuth.user, users.login);
router.post("/signup", users.signUp);
router.get("/:userId", users.getUserById);
router.put("/:userId", checkAuth.user, users.updateUser);
router.delete("/:user_id", checkAuth.user, checkAuth.admin, users.deleteUser);

export default router;
