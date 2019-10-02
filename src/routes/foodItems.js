import express from "express";
const router = express.Router();
import FoodItems from "../controllers/foodItems";
import checkAuth from "../middleware/check_auth";

// endpoints and Controllers
router.get("/", FoodItems.getAllItems);
router.post("/", checkAuth.admin, FoodItems.createItem);
router.get("/:foodItemId", FoodItems.getItemById);
router.get("/search/:searchKey", FoodItems.search);
router.patch("/:foodItemId", checkAuth.admin, FoodItems.updateItem);
router.delete("/:foodItemId", checkAuth.admin, FoodItems.deleteItem);
export default router;
