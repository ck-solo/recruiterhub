import authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class AuthController {
    constructor() {
        this.cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 60 * 60 * 1000 // 1 hour
        };
    }

    register = asyncHandler(async (req, res) => {
        let accessToken = await authService.register(req.body);
        res.cookie("token", accessToken, this.cookieOptions);
        res.success(201, "Registered Successfully.");
    });

    login = asyncHandler(async (req, res) => {
        let accessToken = await authService.login(req.body);
        res.cookie("token", accessToken, this.cookieOptions);
        res.success(200, "LoggedIn Successfully.");
    });

    getUser = asyncHandler(async (req, res) => {
        let user = await authService.getUser(req.user.id);
        res.success(200, "User profile retrieved successfully.", user);
    });

    logout = asyncHandler(async (req, res) => {
        res.clearCookie("token", this.cookieOptions);
        res.success(200, "Logged out successfully.");
    });

    resetPassword = asyncHandler(async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Current password and new password are required." });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
        }
        await authService.resetPassword(req.user.id, currentPassword, newPassword);
        res.success(200, "Password reset successfully.");
    });

    setNewPassword = asyncHandler(async (req, res) => {
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ success: false, message: "New password is required." });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
        }
        await authService.setNewPassword(req.user.id, newPassword);
        res.success(200, "New password set successfully.");
    });

}

export default new AuthController();