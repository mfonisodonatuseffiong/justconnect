// controllers/bookingController.js
const { DateTime } = require("luxon");
const {pool} = require("../config/db");
const {
  createBooking,
  getBookingsByProfessional,
  getBookingsByUser,
} = require("../models/Booking");

/* =========================
   Helpers
========================= */

// Robust date formatter: accepts JS Date, ISO string, or other coercible values
const formatToNigeriaTime = (dateValue) => {
  if (!dateValue) return null;
  try {
    if (dateValue instanceof Date) {
      return DateTime.fromJSDate(dateValue, { zone: "utc" })
        .setZone("Africa/Lagos")
        .toFormat("yyyy-MM-dd HH:mm");
    }
    if (typeof dateValue === "string") {
      // Try ISO first
      const dt = DateTime.fromISO(dateValue, { zone: "utc" });
      if (dt.isValid) {
        return dt.setZone("Africa/Lagos").toFormat("yyyy-MM-dd HH:mm");
      }
      // Fallback to JS Date coercion
      const coerced = new Date(dateValue);
      if (!Number.isNaN(coerced.getTime())) {
        return DateTime.fromJSDate(coerced, { zone: "utc" })
          .setZone("Africa/Lagos")
          .toFormat("yyyy-MM-dd HH:mm");
      }
    }
    // Last resort: attempt to coerce to Date
    const coerced = new Date(dateValue);
    if (!Number.isNaN(coerced.getTime())) {
      return DateTime.fromJSDate(coerced, { zone: "utc" })
        .setZone("Africa/Lagos")
        .toFormat("yyyy-MM-dd HH:mm");
    }
  } catch (err) {
    console.warn("Date formatting error:", err && err.message ? err.message : err);
  }
  return null;
};

const checkRole = (user, allowedRoles) => allowedRoles.includes(user.role);

// Simplified status normalization
const normalizeStatus = (status) => {
  if (!status) return "pending";
  const s = status.toLowerCase();
  switch (s) {
    case "pending":
    case "accepted":
    case "completed":
    case "cancelled":
    case "declined":
      return s;
    default:
      return "pending";
  }
};

/* ============================================================
   Enrich booking with professional, service and user info
   - Safe: handles missing booking, missing related rows, and date formats
============================================================ */
const enrichBooking = async (booking) => {
  if (!booking) {
    console.warn("enrichBooking received null booking");
    return null;
  }

  // Debug: show incoming booking row shape
  console.log("enrichBooking input:", booking);

  try {
    const profRes = await pool.query(
      `SELECT name, location FROM professionals WHERE id=$1`,
      [booking.professional_id]
    );
    const serviceRes = await pool.query(
      `SELECT name FROM services WHERE id=$1`,
      [booking.service_id]
    );
    const userRes = await pool.query(
      `SELECT name, email, phone, address, location, sex FROM users WHERE id=$1`,
      [booking.user_id]
    );

    const professional = profRes.rows[0] || {};
    const service = serviceRes.rows[0] || {};
    const user = userRes.rows[0] || {};

    return {
      id: booking.id,
      user_id: booking.user_id,
      professional_id: booking.professional_id,
      service_id: booking.service_id,
      date: formatToNigeriaTime(booking.date),
      time: booking.time,
      status: normalizeStatus(booking.status),
      notes: booking.notes || "Not provided",
      professional_name: professional.name || `Professional #${booking.professional_id}`,
      professional_location: professional.location || "Not provided",
      service_name: service.name || `Service #${booking.service_id}`,
      client_name: user.name || `User #${booking.user_id}`,
      client_email: user.email || "Not provided",
      client_phone: user.phone || "Not provided",
      client_address: user.address || "Not provided",
      client_location: user.location || "Not provided",
      client_sex: user.sex || "Not provided",
    };
  } catch (err) {
    console.error("enrichBooking error:", err && err.stack ? err.stack : err);
    // Return a minimal safe object so callers can handle it
    return {
      id: booking.id,
      user_id: booking.user_id,
      professional_id: booking.professional_id,
      service_id: booking.service_id,
      date: formatToNigeriaTime(booking.date),
      time: booking.time,
      status: normalizeStatus(booking.status),
      notes: booking.notes || null,
      professional_name: `Professional #${booking.professional_id}`,
      professional_location: "Unknown",
      service_name: `Service #${booking.service_id}`,
    };
  }
};

/* ===============================================================
   CONTROLLERS
=============================================================== */

// Create booking (Users only)
const createNewBooking = async (req, res) => {
  try {
    if (!checkRole(req.user, ["user"])) {
      return res.status(403).json({ success: false, message: "Only users can create bookings" });
    }

    const { professional_id, service_id, date, time, notes } = req.body;
    if (!professional_id || !service_id || !date || !time) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Prevent booking for past dates (compare YYYY-MM-DD)
    const nowDate = new Date().toISOString().split("T")[0];
    if (date < nowDate) {
      return res.status(400).json({ success: false, message: "Cannot book for a past date" });
    }

    // Only block if there's an active booking (pending or accepted)
    const duplicateCheck = await pool.query(
      `SELECT id FROM bookings
       WHERE user_id = $1 
         AND professional_id = $2 
         AND status IN ('pending', 'accepted')`,
      [req.user.id, professional_id]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You already have an active booking with this professional.",
      });
    }

    const bookingData = {
      user_id: req.user.id,
      professional_id,
      service_id,
      date,
      time,
      notes: notes || null,
    };

    const booking = await createBooking(bookingData);

    // Enrich the created booking before returning
    const response = await enrichBooking(booking);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error creating booking:", error && error.stack ? error.stack : error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all bookings (Admin)
const getAll = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM bookings ORDER BY created_at DESC");
    // Optionally enrich here if needed; returning raw rows for admin listing
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getAll bookings error:", err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, message: "Error fetching bookings" });
  }
};

// Get bookings for a user
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    // Authorization: users can only view their own bookings
    if (req.user && req.user.role === "user" && req.user.id.toString() !== userId) {
      return res.status(403).json({ success: false, message: "You cannot view other users' bookings" });
    }

    console.log("getUserBookings called with params:", req.params, "auth user:", req.user?.id, req.user?.role);

    const bookingsRaw = await getBookingsByUser(userId);
    console.log("getBookingsByUser returned type:", typeof bookingsRaw, "isArray:", Array.isArray(bookingsRaw), "rowsLength:", bookingsRaw?.length ?? bookingsRaw?.rows?.length);

    // Defensive guard: if model failed and returned falsy, return empty list instead of throwing
    if (!bookingsRaw) return res.json({ success: true, total: 0, data: [] });

    // Normalize model return shape to an array
    const rows = Array.isArray(bookingsRaw) ? bookingsRaw : (bookingsRaw?.rows || []);

    // Enrich each booking safely
    const detailed = await Promise.all(rows.map(async (r) => {
      try {
        return await enrichBooking(r);
      } catch (e) {
        console.error("enrichBooking failed for booking id:", r?.id, e && e.stack ? e.stack : e);
        return null;
      }
    }));

    const filtered = detailed.filter(Boolean);

    return res.json({
      success: true,
      total: filtered.length,
      data: filtered,
    });
  } catch (err) {
    console.error("Error fetching user bookings stack:", err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, message: "Error fetching user bookings" });
  }
};

// Get bookings for a professional
const getProfessionalBookings = async (req, res) => {
  try {
    const { professionalId } = req.params;

    // Authorization: professionals can only view their own bookings
    if (req.user && req.user.role === "professional" && req.user.id.toString() !== professionalId) {
      return res.status(403).json({ success: false, message: "You can only view your own bookings" });
    }

    const bookingsRaw = await getBookingsByProfessional(professionalId);
    const rows = Array.isArray(bookingsRaw) ? bookingsRaw : (bookingsRaw?.rows || []);

    const detailed = await Promise.all(rows.map(async (r) => {
      try {
        return await enrichBooking(r);
      } catch (e) {
        console.error("enrichBooking failed for booking id:", r?.id, e && e.stack ? e.stack : e);
        return null;
      }
    }));

    const filtered = detailed.filter(Boolean);

    return res.json({
      success: true,
      total: filtered.length,
      data: filtered,
    });
  } catch (err) {
    console.error("Error fetching professional bookings stack:", err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, message: "Error fetching professional bookings" });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE bookings SET status='cancelled' WHERE id=$1`, [id]);
    res.json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    console.error("cancelBooking error:", err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, message: "Error cancelling booking" });
  }
};

// Update booking status
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;

    status = normalizeStatus(status);

    await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2`, [status, id]);
    res.json({ success: true, message: "Booking status updated" });
  } catch (err) {
    console.error("updateStatus error:", err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

// Delete booking record
const deleteBookingRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM bookings WHERE id=$1`, [id]);
    res.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    console.error("deleteBookingRecord error:", err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, message: "Error deleting booking" });
  }
};

module.exports = {
  createNewBooking,
  getAll,
  getUserBookings,
  getProfessionalBookings,
  cancelBooking,
  updateStatus,
  deleteBookingRecord,
};
