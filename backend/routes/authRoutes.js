// routes/authRoutes.js
const express = require("express");
const router = express.Router();

// Controllers & Middlewares
const authController = require("../controllers/authController");
const {
  authenticateToken,
  roleAuthorization,
} = require("../middlewares/authMiddleware");

/**
 * ============================================
 * 🔐 AUTH ROUTES
 * Handles all authentication-related actions
 * ============================================
 */

// ✅ Register new user or professional
router.post("/register", authController.register);

// ✅ Login user or professional
router.post("/login", authController.login);

// ✅ Logout (requires authentication)
router.post("/logout", authenticateToken, authController.logout);

// ✅ Forgot password (generate reset link)
router.post("/forgot-password", authController.forgotPassword);

// ✅ Reset password using valid token
router.post("/reset-password", authController.resetPassword);

// ✅ Get current logged-in user profile
router.get("/me", authenticateToken, authController.getProfile);

/**
 * ============================================
 * 🛡️ ROLE-BASED DASHBOARDS
 * ============================================
 */

// ✅ Admin dashboard (only for admin)
router.get(
  "/admin-dashboard",
  authenticateToken,
  roleAuthorization("admin"),
  (req, res) => {
    res.json({
      message: "Welcome to the Admin Dashboard",
      user: req.user,
    });
  }
);

// ✅ Professional dashboard (only for professionals)
router.get(
  "/professional-dashboard",
  authenticateToken,
  roleAuthorization("professional"),
  (req, res) => {
    res.json({
      message: "Welcome to the Professional Dashboard",
      user: req.user,
    });
  }
);

module.exports = router;
