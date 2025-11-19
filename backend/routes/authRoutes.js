const express = require("express");
const router = express.Router();

// Controllers & Middlewares
const authController = require("../controllers/authController");
const { authenticateToken, roleAuthorization } = require("../middlewares/authMiddleware");

// --- AUTH ROUTES ---
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticateToken, authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/me", authenticateToken, authController.getProfile);

// --- DASHBOARD ROUTES ---
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

// --- DEBUG CHECK ---
if (!authController.refreshToken) {
  console.error("❌ authController.refreshToken is undefined!");
}
