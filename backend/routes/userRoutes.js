import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/user.controller.js";
import  protect  from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register a new user (applicant or recruiter)
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get logged-in user's profile
router.get("/profile", protect, getUserProfile);

export default router;
