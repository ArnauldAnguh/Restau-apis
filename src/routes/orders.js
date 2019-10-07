import express from "express";
import orders from "../controllers/orders";
import validateOrders from "../middleware/orderValidation";
import checkAuth from "../middleware/check_auth";

const router = express.Router();

router.get("/", checkAuth.user, orders.fetchAllOrders);
router.get("/:order_id", checkAuth.user, orders.fetchOrderById);
router.post("/", checkAuth.user, validateOrders.create, orders.placeOrder);
router.put(
  "/:order_id",
  checkAuth.user,
  validateOrders.update,
  orders.updateOrder
);
router.delete("/:order_id", checkAuth.user, orders.deleteOrder);
export default router;
