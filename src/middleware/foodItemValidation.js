import validator from "validator";
import Item from "../models/foodItems";

export default {
  create: async (req, res, next) => {
    try {
      const foodItem = req.body;
      foodItem.name = foodItem.name && validator.trim(foodItem.name);
      const item = await Item.find({ name: foodItem.name });
      if (item.length > 0) {
        return res.status(400).json({
          error: "Food item already exists"
        });
      }
      if (!foodItem.name || validator.isEmpty(foodItem.name)) {
        return res.status(400).json({
          error: "Food item name is required"
        });
      }

      if (req.file.size > 5000000) {
        return res.status(400).json({
          error: "Image size should not be greater than 5MB"
        });
      }
      if (
        foodItem.name &&
        !validator.isLength(foodItem.name, { min: 3, max: 200 })
      ) {
        return res.status(400).json({
          error: "Item name must have between 3 to 200 characters"
        });
      }
      if (!foodItem.description || validator.isEmpty(foodItem.description)) {
        return res.status(400).json({
          error: "Description of item required"
        });
      }
      if (foodItem.description && foodItem.description.length < 50) {
        return res.status(400).json({
          error: "Description must be at least 50 characters"
        });
      }
      if (!foodItem.quantity) {
        return res.status(400).json({
          error: "Food Item Quantity required"
        });
      }
      if (!foodItem.price) {
        return res.status(400).json({
          error: "Price field is required"
        });
      }
      if (foodItem.price && Number.isNaN(parseInt(foodItem.price, 10))) {
        return res.status(400).json({
          error: "Price has to be a number"
        });
      }
      next();
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  },

  update: async (req, res, next) => {
    try {
      const foodItem = req.body;
      const food_item_id = parseInt(req.params.food_item_id, 10);
      if (Number.isNaN(food_item_id)) {
        return res.status(400).json({
          errors: { food_item_id: "A valid food Item Id is required" }
        });
      }
      const item = await Item.find({ name: foodItem.name });
      if (item.length > 0 && item[0].id !== food_item_id) {
        return res.status(400).json({
          error: "Food item already exists"
        });
      }
      next();
    } catch (e) {
      return e;
    }
  }
};
