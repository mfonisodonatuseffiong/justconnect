const express = require("express");
const router = express.Router();
const { createBooking, getBookingsByUser } = require("../controllers/bookingController");

// ✅ Create a new booking
router.post("/", createBooking);

// ✅ Get bookings for a user (optional, e.g., dashboard)
router.get("/:userId", getBookingsByUser);

module.exports = router;
