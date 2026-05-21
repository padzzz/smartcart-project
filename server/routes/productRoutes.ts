import express from "express";
import { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview } from "../controllers/productController.ts";
import { protect, admin } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/:id").get(getProductById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct);
router.route("/:id/reviews").post(protect, createProductReview);

export default router;
