// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const messageController = require("../controllers/messageController");

// ✅ Get all messages for a user
router.get("/user/:userId", authenticateToken, messageController.getUserMessages);

// ✅ Send a new message
router.post("/user/:userId", authenticateToken, messageController.sendMessage);

module.exports = router;
