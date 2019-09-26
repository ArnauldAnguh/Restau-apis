import express from "express";
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handeling GET requests to /foodItems"
  });
});
router.post("/", (req, res, next) => {
  res.status(200).json({
    message: "Handeling POST requests to /foodItems"
  });
});
router.get("/:foodItemId", (req, res, next) => {
  const id = req.params.foodItemId;
  if (id === "special") {
    res.status(200).json({
      message: `You are the ${id} id`,
      id
    });
  } else {
    res.sendStatus(404);
  }
});
router.patch("/:foodItemId", (req, res, next) => {
  res.status(200).json({
    message: `well its ok, updated`
  });
});
router.delete("/:foodItemId", (req, res, next) => {
  res.status(200).json({
    message: `well its ok, DELETED ${req.params.foodItemId}`
  });
});
export default router;
