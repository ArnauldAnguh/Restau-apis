import express from "express";
const router = express.Router();
import FoodItems from "../controllers/foodItems";

// endpoints and Controllers
router.get("/", FoodItems.getAllFoodItems);
router.post("/", FoodItems.createFoodItem);
router.get("/:foodItemId", FoodItems.getFoodItemById);
router.post("/search", FoodItems.search);
router.patch("/:foodItemId", FoodItems.updateFoodItem);
router.delete("/:foodItemId", FoodItems.deleteFoodItem);
export default router;
