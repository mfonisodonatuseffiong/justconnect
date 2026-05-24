const express = require("express");
const router = express.Router();

// Controllers & Middleware
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserSettings,
} = require("../controllers/userController");
const { authenticateToken, roleAuthorization } = require("../middlewares/authMiddleware");

// =========================
// AUTH ROUTES
// =========================

// Register new user (no token required)
router.post("/register", registerUser);

// Login user (no token required)
router.post("/login", loginUser);

// Get user profile (protected)
router.get("/profile/:id", authenticateToken, getUserProfile);

// Update user settings (protected)
router.put("/profile/:id", authenticateToken, updateUserSettings);

// =========================
// ADMIN DASHBOARD (example protected route)
// =========================
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

// =========================
// PROFESSIONAL DASHBOARD (example protected route)
// =========================
router.get(
  "/professional-dashboard",
  authenticateToken,
  roleAuthorization("professional"),
  async (req, res) => {
    try {
      res.json({
        message: "Welcome to the Professional Dashboard",
        user: req.user,
      });
    } catch (error) {
      console.error("Professional Dashboard Error:", error);
      res.status(500).json({ message: "Server error loading dashboard" });
    }
  }
);

module.exports = router;
