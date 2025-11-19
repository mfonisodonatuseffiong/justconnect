// controllers/bookingController.js
const { DateTime } = require("luxon");

const {
  createBooking,
  getAllBookings,
  getBookingsByUser,
  getBookingsByProfessional,
  updateBookingStatus,
  deleteBooking,
} = require("../models/Booking");

// Convert UTC → Nigeria (Lagos)
const formatToNigeriaTime = (utcDate) => {
  if (!utcDate) return null;

  return DateTime.fromJSDate(utcDate, { zone: "utc+1" })
    .setZone("Africa/Lagos")
    .toFormat("yyyy-MM-dd HH:mm");
};

// Simple role checker
const checkRole = (user, allowedRoles) => {
  return allowedRoles.includes(user.role);
};

module.exports = {
  /* ===============================================================
     CREATE BOOKING (Users only)
  ============================================================== */
  createNewBooking: async (req, res) => {
    try {
      // Only USERS can create bookings
      if (!checkRole(req.user, ["user"])) {
        return res
          .status(403)
          .json({ success: false, message: "Only users can create bookings" });
      }

      const { professional_id, service_id, date, time, notes } = req.body;

      if (!professional_id || !service_id || !date || !time) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
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

      let booking;

      try {
        booking = await createBooking(data);
      } catch (error) {
        // Catch conflict errors from model
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      booking.date = formatToNigeriaTime(booking.date);

      return res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: booking,
      });
    } catch (error) {
      console.error("Error creating booking:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  /* ===============================================================
     GET ALL BOOKINGS (Admin)
  ============================================================== */
  getAll: async (req, res) => {
    try {
      if (!checkRole(req.user, ["admin"])) {
        return res
          .status(403)
          .json({ success: false, message: "Admin access required" });
      }

      let bookings = await getAllBookings();

      bookings = bookings.map((b) => ({
        ...b,
        date: formatToNigeriaTime(b.date),
      }));

      return res.json({
        success: true,
        total: bookings.length,
        data: bookings,
      });
    } catch (error) {
      console.error("Error getting all bookings:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Server error" });
    }
  },

  /* ===============================================================
     GET USER BOOKINGS (Users see only theirs)
     Admin can see any user's bookings
  ============================================================== */
  getUserBookings: async (req, res) => {
    try {
      const userId = req.params.userId;

      if (req.user.role === "user" && req.user.id.toString() !== userId) {
        return res
          .status(403)
          .json({ success: false, message: "You cannot view other users' bookings" });
      }

      let bookings = await getBookingsByUser(userId);

      bookings = bookings.map((b) => ({
        ...b,
        date: formatToNigeriaTime(b.date),
      }));

      return res.json({
        success: true,
        total: bookings.length,
        data: bookings,
      });
    } catch (error) {
      console.error("Error getting user bookings:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  /* ===============================================================
     GET PROFESSIONAL BOOKINGS 
     Professional sees only theirs.
     Admin can see all.
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

      if (
        req.user.role === "user"
      ) {
        return res.status(403).json({
          success: false,
          message: "Users cannot view professional bookings",
        });
      }

      let bookings = await getBookingsByProfessional(professionalId);

      bookings = bookings.map((b) => ({
        ...b,
        date: formatToNigeriaTime(b.date),
      }));

      return res.json({
        success: true,
        total: bookings.length,
        data: bookings,
      });
    } catch (error) {
      console.error("Error getting professional bookings:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  /* ===============================================================
     UPDATE BOOKING STATUS (Admin Only)
  ============================================================== */
  updateStatus: async (req, res) => {
    try {
      if (!checkRole(req.user, ["admin"])) {
        return res
          .status(403)
          .json({ success: false, message: "Admin access required" });
      }

      const bookingId = req.params.id;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status field is required",
        });
      }

      const updated = await updateBookingStatus(bookingId, status);

      if (updated?.date) {
        updated.date = formatToNigeriaTime(updated.date);
      }

      return res.json({
        success: true,
        message: "Status updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error("Error updating booking:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  /* ===============================================================
     DELETE BOOKING (Admin Only)
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
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },
};
