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

// Convert UTC → Nigeria (Lagos)
const formatToNigeriaTime = (utcDate) => {
  if (!utcDate) return null;
  return DateTime.fromJSDate(utcDate, { zone: "utc+1" })
    .setZone("Africa/Lagos")
    .toFormat("yyyy-MM-dd HH:mm");
};

// Simple role checker
const checkRole = (user, allowedRoles) => allowedRoles.includes(user.role);

// Allowed booking statuses
const VALID_STATUSES = ["pending", "in_progress", "completed", "cancelled"];

// Helper: enrich booking with professional & service info
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
    date: formatToNigeriaTime(booking.date),
    time: booking.time,
    status: booking.status || "pending",
    notes: booking.notes,
    professional_name: professional.name || "Unknown",
    professional_location: professional.location || "Unknown",
    service_name: service.name || "Unknown",
  };
};

module.exports = {
  /* ===============================================================
     CREATE BOOKING (Users only) + Real-time everything
  ============================================================== */
  createNewBooking: async (req, res) => {
    try {
      if (!checkRole(req.user, ["user"])) {
        return res.status(403).json({ success: false, message: "Only users can create bookings" });
      }

      const { professional_id, service_id, date, time, notes } = req.body;

      if (!professional_id || !service_id || !date || !time) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      // ✅ PREVENT DUPLICATE PENDING BOOKINGS WITH SAME PROFESSIONAL
      const duplicateCheck = await pool.query(
        `SELECT id FROM bookings 
         WHERE user_id = $1 
         AND professional_id = $2 
         AND status = 'pending'`,
        [req.user.id, professional_id]
      );

      if (duplicateCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "You already have a pending booking with this professional. Please wait for confirmation or cancel the existing one before booking again.",
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
        return res.status(400).json({ success: false, message: error.message });
      }

      const response = await enrichBooking(booking);

      // === REAL-TIME BROADCASTS ===
      const io = req.app.get("io");
      if (io) {
        io.to(`user_${req.user.id}`).emit("new_booking");

        const userNotif = await pool.query(
          `INSERT INTO notifications (user_id, message, status, created_at) 
           VALUES ($1, $2, 'unread', NOW()) RETURNING *`,
          [req.user.id, `Your booking with ${response.professional_name} has been confirmed!`]
        );
        io.to(`user_${req.user.id}`).emit("new_notification", userNotif.rows[0]);

        const proNotif = await pool.query(
          `INSERT INTO notifications (user_id, message, status, created_at) 
           VALUES ($1, $2, 'unread', NOW()) RETURNING *`,
          [professional_id, `New booking from ${req.user.name || "a customer"} for ${response.service_name}`]
        );
        io.to(`user_${professional_id}`).emit("new_notification", proNotif.rows[0]);

        const autoMessage = await pool.query(
          `INSERT INTO messages (sender_id, receiver_id, content, created_at) 
           VALUES ($1, $2, $3, NOW()) RETURNING *`,
          [
            req.user.id,
            professional_id,
            `Hello! I've just booked you for ${response.service_name} on ${date} at ${time}. Looking forward to it! ${notes ? `Notes: ${notes}` : ""}`,
          ]
        );
        const enrichedMessage = autoMessage.rows[0];
        io.to(`user_${professional_id}`).emit("new_message", enrichedMessage);
        io.to(`user_${req.user.id}`).emit("new_message", enrichedMessage);

        console.log(`✅ Real-time booking #${booking.id} updates sent`);
      }

      return res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: response,
      });
    } catch (error) {
      console.error("Error creating booking:", error.message);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  /* ===============================================================
     CANCEL BOOKING (Users only) — Free version with discipline
  ============================================================== */
  cancelBooking: async (req, res) => {
    const bookingId = req.params.id;
    const userId = req.user.id;

    try {
      if (!checkRole(req.user, ["user"])) {
        return res.status(403).json({ success: false, message: "Only users can cancel bookings" });
      }

      const bookingRes = await pool.query(
        "SELECT * FROM bookings WHERE id = $1 AND user_id = $2 AND status = 'pending'",
        [bookingId, userId]
      );

      if (bookingRes.rows.length === 0) {
        return res.status(400).json({ success: false, message: "Booking not found or cannot be cancelled" });
      }

      const booking = bookingRes.rows[0];

      await pool.query("UPDATE bookings SET status = 'cancelled' WHERE id = $1", [bookingId]);

      await pool.query(
        `UPDATE users 
         SET cancellation_count = cancellation_count + 1,
             last_cancellation_date = NOW()
         WHERE id = $1`,
        [userId]
      );

      const countRes = await pool.query("SELECT cancellation_count FROM users WHERE id = $1", [userId]);
      const count = countRes.rows[0].cancellation_count;

      let warning = null;
      if (count === 2) {
        warning = "Warning: You've cancelled 2 bookings recently. Please be considerate — repeated cancellations may affect your ability to book.";
      } else if (count >= 3) {
        await pool.query(
          "UPDATE users SET booking_restricted_until = NOW() + INTERVAL '7 days' WHERE id = $1",
          [userId]
        );
        warning = "Important: You've cancelled multiple bookings. New bookings are restricted for 7 days to maintain fairness for professionals.";
      }

      const io = req.app.get("io");
      if (io) {
        const userNotif = await pool.query(
          `INSERT INTO notifications (user_id, message, status, created_at) 
           VALUES ($1, $2, 'unread', NOW()) RETURNING *`,
          [userId, `You have cancelled your booking for ${booking.service_id}.`]
        );
        io.to(`user_${userId}`).emit("new_notification", userNotif.rows[0]);

        const proNotif = await pool.query(
          `INSERT INTO notifications (user_id, message, status, created_at) 
           VALUES ($1, $2, 'unread', NOW()) RETURNING *`,
          [booking.professional_id, `A customer cancelled their booking #${bookingId}.`]
        );
        io.to(`user_${booking.professional_id}`).emit("new_notification", proNotif.rows[0]);

        io.to(`user_${userId}`).emit("booking_cancelled", { bookingId });
        io.to(`user_${booking.professional_id}`).emit("booking_cancelled", { bookingId });
      }

      return res.json({
        success: true,
        message: "Booking cancelled successfully",
        warning,
      });
    } catch (err) {
      console.error("Cancel booking error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  /* ===============================================================
     UPDATE BOOKING STATUS + Real-time KPI & notification updates
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
        const target = bookings.find((b) => b.id.toString() === bookingId);
        if (!target) {
          return res.status(403).json({ success: false, message: "You can only update your own bookings" });
        }
        updated = await updateBookingStatus(bookingId, status);
      } else {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }

      const response = await enrichBooking(updated);

      const io = req.app.get("io");
      if (io) {
        const notif = await pool.query(
          `INSERT INTO notifications (user_id, message, status, created_at) 
           VALUES ($1, $2, 'unread', NOW()) RETURNING *`,
          [updated.user_id, `Your booking #${bookingId} is now ${status.replace("_", " ")}.`]
        );
        io.to(`user_${updated.user_id}`).emit("new_notification", notif.rows[0]);

        if (status === "completed") {
          io.to(`user_${updated.user_id}`).emit("booking_completed");
        }
        io.to(`user_${updated.user_id}`).emit("booking_status_changed", {
          bookingId,
          newStatus: status,
        });
      }

      return res.json({
        success: true,
        message: "Status updated successfully",
        data: response,
      });
    } catch (error) {
      console.error("Error updating booking:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  // Other methods unchanged...
  getAll: async (req, res) => {
    try {
      if (!checkRole(req.user, ["admin"])) {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }
      const bookings = await getAllBookings();
      const detailedBookings = await Promise.all(bookings.map(enrichBooking));
      return res.json({ success: true, total: detailedBookings.length, data: detailedBookings });
    } catch (error) {
      console.error("Error getting all bookings:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  getUserBookings: async (req, res) => {
    try {
      const userId = req.params.userId;
      if (req.user.role === "user" && req.user.id.toString() !== userId) {
        return res.status(403).json({ success: false, message: "You cannot view other users' bookings" });
      }
      const bookings = await getBookingsByUser(userId);
      const detailedBookings = await Promise.all(bookings.map(enrichBooking));
      return res.json({ success: true, total: detailedBookings.length, data: detailedBookings });
    } catch (error) {
      console.error("Error getting user bookings:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  getProfessionalBookings: async (req, res) => {
    try {
      const professionalId = req.params.professionalId;
      if (req.user.role === "professional" && req.user.id.toString() !== professionalId) {
        return res.status(403).json({ success: false, message: "You can only view your own bookings" });
      }
      if (req.user.role === "user") {
        return res.status(403).json({ success: false, message: "Users cannot view professional bookings" });
      }
      const bookings = await getBookingsByProfessional(professionalId);
      const detailedBookings = await Promise.all(bookings.map(enrichBooking));
      return res.json({ success: true, total: detailedBookings.length, data: detailedBookings });
    } catch (error) {
      console.error("Error getting professional bookings:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  deleteBookingRecord: async (req, res) => {
    try {
      if (!checkRole(req.user, ["admin"])) {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }
      const bookingId = req.params.id;
      const result = await deleteBooking(bookingId);
      return res.json({ success: true, message: result.message });
    } catch (error) {
      console.error("Error deleting booking:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },
};