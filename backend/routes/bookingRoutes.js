const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");
const { pool } = require("../config/db"); // ✅ correct import

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

// ✅ API to check if user has any active booking (minimal response)
router.get(
  "/user/:id/active/check",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      console.log("📊 Checking active bookings for user:", id);

      const result = await pool.query(
        `SELECT id 
         FROM bookings 
         WHERE customer_id = $1 
           AND status IN ('incoming','accepted','on_going') 
         LIMIT 1`,
        [id]
      );

      console.log("📊 Query result:", result.rows);

      if (result.rows.length > 0) {
        res.json({ success: true, active: true, booking_id: result.rows[0].id });
      } else {
        res.json({ success: true, active: false });
      }
    } catch (err) {
      console.error("❌ Error checking active booking:", err.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// ✅ User - get their own bookings
router.get(
  "/user/:userId",
  authenticateToken,
  bookingController.getUserBookings
);

// ✅ Professional or Admin - view bookings assigned to a professional
router.get(
  "/professional/:professionalId",
  authenticateToken,
  authorizeRoles("professional", "admin"),
  bookingController.getProfessionalBookings
);

// ✅ User - cancel their own pending booking
router.post(
  "/:id/cancel",
  authenticateToken,
  authorizeRoles("user"),
  bookingController.cancelBooking
);

// ✅ Admin or Professional - update booking status
router.put(
  "/:id/status",
  authenticateToken,
  authorizeRoles("admin", "professional"),
  bookingController.updateStatus
);

// ✅ Admin only - delete booking record
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  bookingController.deleteBookingRecord
);

module.exports = router;
