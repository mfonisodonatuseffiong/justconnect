// controllers/bookingController.js
const { DateTime } = require("luxon");
const pool = require("../config/db");

const {
  createBooking,
  getAllBookings,
  getBookingsByUser,
  getBookingsByProfessional,
  updateBookingStatus,
  deleteBooking,
} = require("../models/Booking");

/* =========================
   Helpers
========================= */

// Convert UTC → Nigeria (Lagos)
const formatToNigeriaTime = (utcDate) => {
  if (!utcDate) return null;
  return DateTime.fromJSDate(utcDate, { zone: "utc" })
    .setZone("Africa/Lagos")
    .toFormat("yyyy-MM-dd HH:mm");
};

// Simple role checker
const checkRole = (user, allowedRoles) => allowedRoles.includes(user.role);

// Allowed booking statuses
const VALID_STATUSES = [
  "pending",
  "accepted",
  "in_progress",
  "completed",
  "cancelled",
];

// Normalize statuses for frontend charts
const normalizeStatus = (status) => {
  if (!status) return "pending";
  const s = status.toLowerCase();
  if (s === "accepted") return "completed";
  if (s === "in_progress") return "pending";
  return s;
};

// Enrich booking with professional & service info
const enrichBooking = async (booking) => {
  const profRes = await pool.query(
    `SELECT name, location FROM professionals WHERE id=$1`,
    [booking.professional_id]
  );
  const serviceRes = await pool.query(
    `SELECT name FROM services WHERE id=$1`,
    [booking.service_id]
  );

  const professional = profRes.rows[0] || {};
  const service = serviceRes.rows[0] || {};

  return {
    id: booking.id,
    user_id: booking.user_id,
    professional_id: booking.professional_id,
    service_id: booking.service_id,
    date: formatToNigeriaTime(booking.date),
    time: booking.time,
    status: normalizeStatus(booking.status),
    notes: booking.notes,
    professional_name: professional.name || "Unknown",
    professional_location: professional.location || "Unknown",
    service_name: service.name || "Unknown",
  };
};

/* =========================
   Controller
========================= */
const bookingController = {
  /* ===============================================================
     CREATE BOOKING (Users only)
  ============================================================== */
  createNewBooking: async (req, res) => {
    try {
      if (!checkRole(req.user, ["user"])) {
        return res
          .status(403)
          .json({ success: false, message: "Only users can create bookings" });
      }

      const { professional_id, service_id, date, time, notes } = req.body;
      if (!professional_id || !service_id || !date || !time) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      // Prevent duplicate pending bookings
      const duplicateCheck = await pool.query(
        `SELECT id FROM bookings 
         WHERE user_id = $1 AND professional_id = $2 AND status = 'pending'`,
        [req.user.id, professional_id]
      );

      if (duplicateCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "You already have a pending booking with this professional.",
        });
      }

      const data = {
        user_id: req.user.id,
        professional_id,
        service_id,
        date,
        time,
        notes: notes || null,
      };

      const booking = await createBooking(data);
      const response = await enrichBooking(booking);

      return res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: response,
      });
    } catch (error) {
      console.error("Error creating booking:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  /* ===============================================================
     CANCEL BOOKING (Users only)
  ============================================================== */
  cancelBooking: async (req, res) => {
    const bookingId = req.params.id;
    const userId = req.user.id;

    try {
      if (!checkRole(req.user, ["user"])) {
        return res
          .status(403)
          .json({ success: false, message: "Only users can cancel bookings" });
      }

      const bookingRes = await pool.query(
        "SELECT * FROM bookings WHERE id = $1 AND user_id = $2 AND status = 'pending'",
        [bookingId, userId]
      );

      if (bookingRes.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Booking not found or cannot be cancelled",
        });
      }

      await pool.query(
        "UPDATE bookings SET status = 'cancelled' WHERE id = $1",
        [bookingId]
      );

      return res.json({
        success: true,
        message: "Booking cancelled successfully",
      });
    } catch (err) {
      console.error("Cancel booking error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Server error" });
    }
  },

  /* ===============================================================
     UPDATE BOOKING STATUS
  ============================================================== */
  updateStatus: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const { status } = req.body;

      if (!status || !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status must be one of: ${VALID_STATUSES.join(", ")}`,
        });
      }

      let updated;

      if (req.user.role === "admin") {
        updated = await updateBookingStatus(bookingId, status);
      } else if (req.user.role === "professional") {
        const bookings = await getBookingsByProfessional(req.user.id);
        const target = bookings.find(
          (b) => b.id.toString() === bookingId
        );

        if (!target) {
          return res.status(403).json({
            success: false,
            message: "You can only update your own bookings",
          });
        }

        updated = await updateBookingStatus(bookingId, status);
      } else {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized" });
      }

      const response = await enrichBooking(updated);

      return res.json({
        success: true,
        message: "Status updated successfully",
        data: response,
      });
    } catch (error) {
      console.error("Error updating booking:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Server error" });
    }
  },

  /* ===============================================================
     GET ALL BOOKINGS (Admin only)
  ============================================================== */
  getAll: async (req, res) => {
    try {
      if (!checkRole(req.user, ["admin"])) {
        return res
          .status(403)
          .json({ success: false, message: "Admin access required" });
      }

      const bookings = await getAllBookings();
      const detailedBookings = await Promise.all(
        bookings.map(enrichBooking)
      );

      return res.json({
        success: true,
        total: detailedBookings.length,
        data: detailedBookings,
      });
    } catch (error) {
      console.error("Error getting all bookings:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Server error" });
    }
  },

  /* ===============================================================
     GET BOOKINGS BY USER
  ============================================================== */
  getUserBookings: async (req, res) => {
    try {
      const userId = req.params.userId;

      if (
        req.user.role === "user" &&
        req.user.id.toString() !== userId
      ) {
        return res.status(403).json({
          success: false,
          message: "You cannot view other users' bookings",
        });
      }

      const bookings = await getBookingsByUser(userId);
      const detailedBookings = await Promise.all(
        bookings.map(enrichBooking)
      );

      return res.json({
        success: true,
        total: detailedBookings.length,
        data: detailedBookings,
      });
    } catch (error) {
      console.error("Error getting user bookings:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Server error" });
    }
  },

  /* ===============================================================
     GET BOOKINGS BY PROFESSIONAL
  ============================================================== */
  getProfessionalBookings: async (req, res) => {
    try {
      const professionalId = req.params.professionalId;

      if (
        req.user.role === "professional" &&
        req.user.id.toString() !== professionalId
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only view your own bookings",
        });
      }

      if (req.user.role === "user") {
        return res.status(403).json({
          success: false,
          message: "Users cannot view professional bookings",
        });
      }

      const bookings = await getBookingsByProfessional(professionalId);
      const detailedBookings = await Promise.all(
        bookings.map(enrichBooking)
      );

      return res.json({
        success: true,
        total: detailedBookings.length,
        data: detailedBookings,
      });
    } catch (error) {
      console.error("Error getting professional bookings:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Server error" });
    }
  },

  /* ===============================================================
     DELETE BOOKING RECORD (Admin only)
  ============================================================== */
  deleteBookingRecord: async (req, res) => {
    try {
      if (!checkRole(req.user, ["admin"])) {
        return res
          .status(403)
          .json({ success: false, message: "Admin access required" });
      }

      const bookingId = req.params.id;
      const result = await deleteBooking(bookingId);

      return res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error("Error deleting booking:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Server error" });
    }
  },
};

module.exports = bookingController;
