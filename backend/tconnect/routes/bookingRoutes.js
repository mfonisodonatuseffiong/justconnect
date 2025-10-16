const express = require("express");
const router = express.Router();
const {
  createNewBooking,
  getAll,
  getUserBookings,
  getProfessionalBookings,
  updateStatus,
  deleteBookingRecord,
} = require("../controllers/bookingController");

/**
 * ==============================================
 * BOOKING ROUTES
 * Handles all booking operations
 * Base URL: /api/v1/bookings
 * ==============================================
 */

// 🟢 Create a new booking (“Hire Me”)
router.post("/", createNewBooking);

// 🔵 Get all bookings (admin or internal use)
router.get("/", getAll);

// 🟣 Get all bookings by user ID
router.get("/user/:userId", getUserBookings);

// 🟠 Get all bookings by professional ID
router.get("/pro/:professionalId", getProfessionalBookings);

// 🟡 Update booking status (accept/reject/complete)
router.put("/:id/status", updateStatus);

// 🔴 Delete a booking
router.delete("/:id", deleteBookingRecord);

module.exports = router;
