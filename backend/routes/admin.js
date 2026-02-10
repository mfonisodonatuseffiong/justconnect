const express = require("express");
const router = express.Router();

// Import the whole controller object
const adminController = require("../controllers/adminController");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRoles("admin"));

// Dashboard stats (counts)
router.get("/stats", adminController.getDashboardStats);

// Users management
router.get("/users", adminController.getAllUsers);
router.delete("/users/:id", adminController.deleteUser);

// Professionals management
router.get("/professionals", adminController.getAllProfessionals);
router.delete("/professionals/:id", adminController.deleteProfessional);
router.put("/professionals/:id/approve", adminController.approveProfessional);

// Services management
router.get("/services", adminController.getAllServices);
router.delete("/services/:id", adminController.deleteService);

router.get("/recent-bookings", adminController.getRecentBookings);
router.get("/recent-activity", adminController.getRecentActivity);


module.exports = router;

