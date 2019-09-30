import express from "express";
import orders from "../controllers/orders";

const router = express.Router();

router.get("/", orders.fetchAllOrders);
router.get("/:order_id", orders.fetchOrderById);
router.post("/", orders.placeOrder);
router.put("/:order_id", orders.updateOrder);
router.delete("/:order_id", orders.deleteOrder);
export default router;
