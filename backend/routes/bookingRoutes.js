const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");

// ======================================================
// BOOKING ROUTES
// ======================================================

// ✅ Users create a booking
router.post(
  "/", 
  authenticateToken, 
  authorizeRoles("user"), 
  bookingController.createNewBooking
);

// ✅ Admin only - get all bookings
router.get(
  "/", 
  authenticateToken, 
  authorizeRoles("admin"), 
  bookingController.getAll
);

// ✅ User - get their own bookings
router.get(
  "/user/:userId",
  authenticateToken,
  bookingController.getUserBookings
);

// ✅ Professional or Admin - view bookings assigned to a professional
router.get(
  "/pro/:professionalId",
  authenticateToken,
  authorizeRoles("professional", "admin"),
  bookingController.getProfessionalBookings
);

// ✅ Admin only - update booking status
router.put(
  "/:id/status",
  authenticateToken,
  authorizeRoles("admin"),
  bookingController.updateStatus
);

// ✅ Admin only - delete booking
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  bookingController.deleteBookingRecord
);

module.exports = router;
