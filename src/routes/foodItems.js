import express from "express";
const router = express.Router();
import path from "path";
import FoodItems from "../controllers/foodItems";
import checkAuth from "../middleware/check_auth";
import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${path.basename(
        file.originalname,
        path.extname(file.originalname)
      )}.${Date.now()}.${path.extname(file.originalname)}`
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
router.post(
  "/",
  upload.single("image"),
  checkAuth.user,
  checkAuth.admin,
  FoodItems.createItem
);
router.get("/:foodItemId", FoodItems.getItemById);
router.get("/search/:searchKey", FoodItems.search);
router.patch(
  "/:foodItemId",
  checkAuth.user,
  checkAuth.admin,
  FoodItems.updateItem
);
router.delete(
  "/:foodItemId",
  checkAuth.user,
  checkAuth.admin,
  FoodItems.deleteItem
);

export default router;
