import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/adminController.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", authAdmin, getAdminProfile);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;