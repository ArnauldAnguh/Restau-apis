import fs from "fs";
import FoodItem from "../models/foodItems";
export default {
  async getAllItems(req, res) {
    const allFoodItems = await FoodItem.find({});
    return res.status(200).send({ data: allFoodItems, message: "success" });
  },

  async getItemById(req, res) {
    const foodItem_id = parseInt(req.params.foodItemId, 10);

    if (!Number.isInteger(foodItem_id)) {
      return res
        .status(400)
        .send({ foodItem_id: "Enter a valid food Item Id" });
    }

    const foodItem = await FoodItem.findById(foodItem_id);
    if (!foodItem) {
      return res.status(200).send({ Result: "Food item not found" });
    }
    return res.status(200).send({
      data: foodItem,
      message: `success in fetching item ${foodItem.id}`
    });
  },

  async createItem(req, res) {
    const foodItem = new FoodItem(req.body);
    foodItem.image = req.file.filename;
    const newFoodItem = await foodItem.save();
    return res
      .status(201)
      .send({ data: newFoodItem, message: "Food item created successfully" });
  },

  async updateItem(req, res) {
    const foodItem_id = parseInt(req.params.foodItemId, 10);

    const foundFoodItem = await FoodItem.findById(foodItem_id);
    if (!foundFoodItem) {
      return res.status(404).send({ message: "Food item not found" });
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
  },

  async deleteItem(req, res) {
    const foodItem_id = parseInt(req.params.foodItemId, 10);
    const foodItem = await FoodItem.findById(foodItem_id);
    await FoodItem.delete(foodItem_id);

    fs.unlink(`../uploads/${foodItem.image}`, err => {
      if (err) {
        return res.send({ error: "There was a problem deleting file" });
      }
      return res.status(200).json({ message: "Item deleted successfully" });
    });
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
