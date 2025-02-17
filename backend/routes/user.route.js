import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.post("/register", singleUpload, register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/profile/update", isAuthenticated, singleUpload, updateProfile);

// Forgot password & reset password routes
router.post("/forgot-password", forgotPassword);  // ✅ Sends reset email
router.post("/reset-password/:token", resetPassword);   // ✅ Resets password

export default router;
