import express from "express";
const router = express.Router();

// Handles incoming Get requests from /orders
router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Orders where Fetched"
  });
});

router.post("/", (req, res, next) => {
  res.status(200).json({
    message: "Orders was Created"
  });
});
router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Order delete",
    orderId: req.params.orderId
  });
});
export default router;
