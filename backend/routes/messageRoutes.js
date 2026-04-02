const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const messageController = require("../controllers/messageController");

/**
 * USER MESSAGES
 */
// Get all messages for a user
router.get("/user/:userId", authenticateToken, messageController.getUserMessages);

// Send a new message as a user
router.post("/user/:userId", authenticateToken, messageController.sendMessage);

/**
 * PROFESSIONAL MESSAGES
 */
// Get all messages for a professional
router.get("/pro/:professionalId", authenticateToken, messageController.getProfessionalMessages);

// Send a new message as a professional
router.post("/pro/:professionalId", authenticateToken, messageController.sendMessage);

module.exports = router;
