import validator from "validator";

function validate(order) {
  const errors = {};

  if (!order.fooditem) {
    errors.item_id = "Item required";
  }

  if (!Number.isInteger(parseInt(order.quantity, 10))) {
    errors.quantity = "Quantity is required and must be a Number";
  }

  // if (!order.status || validator.isEmpty(order.status)) {
  //   errors.status = "Order status required";
  // }

  return errors;
}

export default {
  create(req, res, next) {
    const order = req.body;
    const errors = validate(order);

    if (Object.keys(errors).length !== 0) {
      return res.status(400).json({ errors });
    }
    next();
  },

  update(req, res, next) {
    const order = req.body;
    const errors = validate(order);

    if (Object.keys(errors).length !== 0) {
      return res.status(400).json({ errors });
    }
    next();
  }
};
