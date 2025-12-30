const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const { getUserProfile, updateUserSettings } = require("../controllers/userController");

// Get user profile
router.get("/:id", authenticateToken, getUserProfile);

// Update user settings
router.put("/:id", authenticateToken, updateUserSettings);

module.exports = router;
