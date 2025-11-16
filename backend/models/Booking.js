const pool = require("../../db");

/**
 * ==============================================
 * BOOKING MODEL
 * Handles all database operations for bookings
 * ==============================================
 */

// ✅ Ensure the bookings table exists
const ensureBookingTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      professional_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      date DATE,
      time TIME,
      status VARCHAR(20) DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log("📦 Bookings table exists or created.");
  } catch (error) {
    console.error("❌ Error ensuring bookings table:", error.message);
  }
};

// ✅ Create a new booking
const createBooking = async (data) => {
  const { user_id, professional_id, service_id, date, time, notes } = data;
  const query = `
    INSERT INTO bookings (user_id, professional_id, service_id, date, time, notes, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'pending')
    RETURNING *;
  `;
  const result = await pool.query(query, [user_id, professional_id, service_id, date, time, notes]);
  return result.rows[0];
};

// ✅ Get all bookings (admin use)
const getAllBookings = async () => {
  const result = await pool.query(`
    SELECT * FROM bookings ORDER BY created_at DESC;
  `);
  return result.rows;
};

// ✅ Get bookings by user
const getBookingsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC;`,
    [userId]
  );
  return result.rows;
};

// ✅ Get bookings by professional (for their dashboard)
const getBookingsByProfessional = async (professionalId) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE professional_id = $1 ORDER BY created_at DESC;`,
    [professionalId]
  );
  return result.rows;
};

// ✅ Update booking status (e.g., accepted, rejected, completed)
const updateBookingStatus = async (bookingId, status) => {
  const result = await pool.query(
    `UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;`,
    [status, bookingId]
  );
  return result.rows[0];
};

// ✅ Delete booking (if needed)
const deleteBooking = async (bookingId) => {
  await pool.query(`DELETE FROM bookings WHERE id = $1;`, [bookingId]);
  return { message: "Booking deleted successfully" };
};

module.exports = {
  ensureBookingTable,
  createBooking,
  getAllBookings,
  getBookingsByUser,
  getBookingsByProfessional,
  updateBookingStatus,
  deleteBooking,
};
