// routes/messageRoutes.js
/**
 * Message Routes
 * Handles user messaging functionality
 */

const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const messageController = require("../controllers/messageController");

/**
 * @route   GET /api/v1/messages/user/:userId
 * @desc    Get all messages for a specific user
 * @access  Private (authenticated user)
 */
router.get("/user/:userId", authenticateToken, messageController.getUserMessages);

/**
 * @route   POST /api/v1/messages/user/:userId
 * @desc    Send a new message to a user
 * @access  Private (authenticated user)
 */
router.post("/user/:userId", authenticateToken, messageController.sendMessage);

module.exports = router;