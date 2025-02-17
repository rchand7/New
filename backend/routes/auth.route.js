import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/auth.controller.js';

const router = express.Router();

// Forgot Password Route
router.post('/forgot-password', forgotPassword);

// Reset Password Route
router.post('/reset-password/:token', resetPassword);

export default router;
