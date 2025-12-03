const express = require("express");
const router = express.Router();

// Controllers & Middlewares
const authController = require("../controllers/authController");
const { authenticateToken, roleAuthorization } = require("../middlewares/authMiddleware");

// --- Helper: attach routes only if the handler exists ---
const safeRoute = (method, path, ...handlers) => {
  const validHandlers = handlers.filter(fn => typeof fn === "function");
  if (validHandlers.length === 0) {
    console.warn(`⚠️ Skipped route ${method.toUpperCase()} ${path} — no valid handler`);
    return;
  }
  router[method](path, ...validHandlers);
};

// --- AUTH ROUTES ---
safeRoute("post", "/register", authController.register);
safeRoute("post", "/login", authController.login);
safeRoute("post", "/logout", authenticateToken, authController.logout);
safeRoute("post", "/forgot-password", authController.forgotPassword);
safeRoute("post", "/reset-password", authController.resetPassword);
safeRoute("get", "/me", authenticateToken, authController.getProfile);

// --- ADMIN DASHBOARD ---
safeRoute(
  "get",
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

// --- PROFESSIONAL DASHBOARD ---
safeRoute(
  "get",
  "/professional-dashboard",
  authenticateToken,
  roleAuthorization("professional"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      if (!authController.getUserProfileById || typeof authController.getUserProfileById !== "function") {
        return res.status(500).json({ message: "Server error: getUserProfileById missing" });
      }

      const fullProfile = await authController.getUserProfileById(req, res);

      res.json({
        message: "Welcome to the Professional Dashboard",
        user: fullProfile,
      });
    } catch (error) {
      console.error("Professional Dashboard Error:", error);
      res.status(500).json({ message: "Server error loading dashboard" });
    }
  }
);

module.exports = router;
