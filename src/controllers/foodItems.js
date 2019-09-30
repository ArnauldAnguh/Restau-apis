import FoodItem from "../models/foodItems";

export default {
  async getAllFoodItems(req, res) {
    const allFoodItems = await FoodItem.find({});
    return res.status(200).send({ data: allFoodItems, message: "success" });
  },

  async getFoodItemById(req, res) {
    const foodItem_id = parseInt(req.params.foodItemId, 10);
    console.log(req.params);
    if (!foodItem_id || Number.isNaN(foodItem_id)) {
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

  async createFoodItem(req, res) {
    const foodItem = new FoodItem(req.body);
    const newFoodItem = await foodItem.save();
    return res
      .status(201)
      .send({ data: newFoodItem, message: "Food item created successfully" });
  },

  async updateFoodItem(req, res) {
    const foodItem_id = parseInt(req.params.foodItemId, 10);
    console.log(req.body);
    const removedFoodItem = await FoodItem.findById(foodItem_id);
    if (!removedFoodItem) {
      return res.status(404).send({ message: "Food item not found" });
    }
    removedFoodItem.name = req.body.name;
    removedFoodItem.description = req.body.description;
    removedFoodItem.quantity = req.body.quantity;
    removedFoodItem.price = req.body.price;
    const updatedFoodItem = await removedFoodItem.update();
    return res
      .status(200)
      .json({ data: updatedFoodItem, message: "Item updated successfully" });
  },

  async deleteFoodItem(req, res) {
    const foodItem_id = parseInt(req.params.foodItemId, 10);
    const foodItem = await FoodItem.findById(foodItem_id);
    await FoodItem.delete(foodItem_id);
    return res.status(200).json({ message: "Item deleted successfully" });
  },

  async search(req, res) {
    const { item } = req.body;
    console.log(item);
    if (!item || item.length < 3) {
      return res
        .status(400)
        .json({ msg: "You Must provide morethan 3 words to search" });
    }
    const items = await FoodItem.search(item);
    return res.status(200).json(items);
  }
};
