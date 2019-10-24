import fs from "fs";
import FoodItem from "../models/foodItems";
export default {
  async getAllItems(req, res) {
    const allFoodItems = await FoodItem.find({});
    return res.status(200).json({ data: allFoodItems, message: "success" });
  },

  async getItemById(req, res) {
    const foodItem_id = parseInt(req.params.foodItemId, 10);

    if (!Number.isInteger(foodItem_id)) {
      return res
        .status(400)
        .json({ foodItem_id: "Enter a valid food Item Id" });
    }

    const foodItem = await FoodItem.findById(foodItem_id);
    if (!foodItem) {
      return res.status(200).json({ Result: "Food item not found" });
    }
    return res.status(200).json({
      data: foodItem,
      message: `success in fetching item ${foodItem.id}`
    });
  },

  async createItem(req, res) {
    const foodItem = new FoodItem(req.body);
    try {
      foodItem.image = req.file.filename;
      if (!foodItem.image) {
        return res.status(400).json({
          error: "Food item image required"
        });
      }
      const newFoodItem = await foodItem.save();
      return res
        .status(201)
        .json({ data: newFoodItem, message: "Food item created successfully" });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  },

  async updateItem(req, res) {
    const foodItem_id = parseInt(req.params.foodItemId, 10);
    try {
      const foundFoodItem = await FoodItem.findById(foodItem_id);
      if (!foundFoodItem) {
        return res.status(404).json({ error: "Food item not found" });
      }
      foundFoodItem.name = req.body.name;
      foundFoodItem.image = req.body.image;
      foundFoodItem.description = req.body.description;
      foundFoodItem.quantity = req.body.quantity;
      foundFoodItem.price = req.body.price;
      const updatedFoodItem = await foundFoodItem.update();
      return res
        .status(200)
        .json({ data: updatedFoodItem, message: "Item updated successfully" });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  },

  async deleteItem(req, res) {
    try {
      const foodItem_id = parseInt(req.params.foodItemId, 10);
      const foodItem = await FoodItem.findById(foodItem_id);
      await FoodItem.delete(foodItem_id);
      console.log("FOOD ITEM", foodItem.image);
      fs.unlink(`./src/uploads/${foodItem.image}`, err => {
        if (err) {
          res.status(400).json({ error: "There was an error deleting file" });
        }
        return res.status(204).json({ message: "Item deleted successfully" });
      });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  },

  async search(req, res) {
    const item = req.params.searchKey;
    let query = req.query;
    if (!item || item.length < 3) {
      return res
        .status(400)
        .json({ msg: "You Must provide atleast 3 characters to search" });
    }
    const found = await FoodItem.search(item);
    if (found === []) {
      return res.status(403).json({ msg: "Searched Item Not Found!" });
    } else {
      return res.status(200).json({ results: "search results", item: found });
    }
  }
};
