import validator from "validator";
const statusEnum = [
  "COMPLETED",
  "CANCELLED",
  "PROCESSING",
  "DECLINED",
  "ACCEPTED",
  "NEW"
];
export default {
  create(req, res, next) {
    const order = req.body;
    if (!order.fooditem) {
      return res.status(400).json({ errors: "Item required" });
    }

    if (!Number.isInteger(parseInt(order.quantity, 10))) {
      return res
        .status(400)
        .json({ errors: "Quantity is required and must be a Number" });
    }
    next();
  },

  update(req, res, next) {
    const order = req.body;
    if (order.status && !statusEnum.includes(order.status)) {
      return res.status(400).json({
        errors:
          "Order status must be either, COMPLETED, CANCELLED, PROCESSING, DECLINED, ACCEPTED, NEW"
      });
    }
    if (order.fooditem && validator.isEmpty(order.fooditem)) {
      return res.status(400).json({ errors: "Item required" });
    }
    if (!order.status || validator.isEmpty(order.status)) {
      return res.status(400).json({ errors: "Order status required" });
    }
    if (order.quantity && !Number.isInteger(parseInt(order.quantity, 10))) {
      return res
        .status(400)
        .json({ errors: "Quantity is required and must be a Number" });
    }
    console.log(order);
    next();
  }
};
