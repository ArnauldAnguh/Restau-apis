import express from "express";
import orders from "../controllers/orders";
import checkAuth from "../middleware/check_auth";

const router = express.Router();

router.get("/", checkAuth.user, orders.fetchAllOrders);
router.get("/:order_id", checkAuth.user, orders.fetchOrderById);
router.post("/", checkAuth.user, orders.placeOrder);
router.put("/:order_id", checkAuth.user, orders.updateOrder);
router.delete("/:order_id", checkAuth.user, orders.deleteOrder);
export default router;
