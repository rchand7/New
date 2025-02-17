import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Forgot Password - Sends reset link to email
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "No account found with this email.",
                success: false,
            });
        }

        // Create a reset token
        const resetToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // Send reset link via email
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            message: "Password reset link sent to your email.",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to send password reset email.",
            success: false,
        });
    }
};

// Reset Password - Allows user to reset their password
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({
                message: "New password is required.",
                success: false,
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false,
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Password has been reset successfully.",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to reset password.",
            success: false,
        });
    }
};
