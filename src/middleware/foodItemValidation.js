import validator from "validator";
import Item from "../models/foodItems";

function validate(foodItem) {
  const errors = {};
  foodItem.name = foodItem.name && validator.trim(foodItem.name);

  if (
    foodItem.name &&
    !validator.isLength(foodItem.name, { min: 3, max: 200 })
  ) {
    errors.name = "Item name must have between 3 to 200 characters";
  }
  if (!foodItem.name || validator.isEmpty(foodItem.name)) {
    errors.name = "Food item name is required";
  }

  if (foodItem.description && foodItem.description.length < 100) {
    errors.description = "Description must be at least 100 characters";
  }
  if (!foodItem.description || validator.isEmpty(foodItem.description)) {
    errors.description = "Description of item required";
  }

  if (foodItem.quantity && Number.isNaN(parseInt(foodItem.quantity, 10))) {
    errors.quantity = "Quantity has to be a number";
  }

  if (!foodItem.quantity) {
    errors.quantity = "Food Item Quantity required";
  }

  if (foodItem.price && Number.isNaN(parseInt(foodItem.price, 10))) {
    errors.unit_price = "Price has to be a number";
  }

  if (!foodItem.price) {
    errors.unit_price = "Price is required";
  }

  return errors;
}

export default {
  async create(req, res, next) {
    const foodItem = req.body;
    const errors = validate(foodItem);

    const item = await Item.find({ name: foodItem.name });
    if (item.length > 0) {
      errors.name = "Food item already exists";
    }
    if (!req.file) {
      errors.image = "Food item image required";
    } else if (req.file.size > 5000000) {
      errors.image = "Image size should not be greater than 5MB";
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(400).json({ errors });
    }
    next();
  },

  async update(req, res, next) {
    const foodItem = req.body;
    const food_item_id = parseInt(req.params.food_item_id, 10);
    const errors = validation(foodItem);

    if (!food_item_id || Number.isNaN(food_item_id)) {
      return res
        .status(400)
        .send({ errors: { food_item_id: "A valid food Item Id is required" } });
    }

    const item = await Item.find({ name: foodItem.name });
    if (item.length > 0 && item[0].id !== food_item_id) {
      errors.name = "Food item already exists";
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(400).json({ errors });
    }
    next();
  }
};
