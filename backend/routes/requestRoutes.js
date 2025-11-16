// routes/requestRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");
const { createRequest } = require("../controllers/dashboardController");

/**
 * ==========================================================
 * REQUEST ROUTES
 * ==========================================================
 * - All routes are protected with JWT
 * - Only 'user' role can create service requests
 * ==========================================================
 */

// 🟢 Create a new service request (user only)
router.post("/", authenticateToken, authorizeRoles("user"), createRequest);

module.exports = router;
