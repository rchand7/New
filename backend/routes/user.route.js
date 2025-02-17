import express from "express";
import { login, logout, register, updateProfile, forgotPassword, resetPassword } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

// Forgot password & reset password routes
router.route("/forgot-password").post(forgotPassword); // POST to request a reset email
router.route("/reset-password/:token").post(resetPassword); // POST to reset the password using the token

export default router;
