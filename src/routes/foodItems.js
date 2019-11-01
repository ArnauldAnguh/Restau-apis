import express from "express";
const router = express.Router();
import path from "path";
import FoodItems from "../controllers/foodItems";
import checkAuth from "../middleware/check_auth";
import foodItemValidation from "../middleware/foodItemValidation";

import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${path.basename(
        file.originalname,
        path.extname(file.originalname)
      )}.${Date.now()}${path.extname(file.originalname)}`
    );
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/svg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid File type"), true);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
});

// endpoints and Controllers
router.get("/", FoodItems.getAllItems);
router.get("/menu", checkAuth.user, FoodItems.getAllItems);
router.post(
  "/menu",
  upload.single("image"),
  foodItemValidation.create,
  FoodItems.createItem
);
router.post("/:searchKey", FoodItems.search);
router.get("/menu/:foodItemId", FoodItems.getItemById);
router.put(
  "/menu/:foodItemId",
  checkAuth.user,
  checkAuth.admin,
  foodItemValidation.update,
  FoodItems.updateItem
);
router.delete(
  "/menu/:foodItemId",
  checkAuth.user,
  checkAuth.admin,
  FoodItems.deleteItem
);

export default router;
