import express from "express";
import users from "../controllers/authController";

const router = express.Router();

router.get("/", users.getAllUsers);
router.get("/admin", users.getAllAdmins);
router.post("/admin", users.registerAdminUser);
router.post("/login", users.login);
router.post("/signup", users.signUp);
router.get("/:userId", users.getUserById);
router.patch("/:userId", users.updateUser);
router.delete("/:user_id", users.deleteUser);

export default router;
