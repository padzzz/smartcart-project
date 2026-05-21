import express from "express";
import { authUser, registerUser, getUserProfile, updateUserProfile } from "../controllers/userController.ts";
import { protect } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

export default router;
