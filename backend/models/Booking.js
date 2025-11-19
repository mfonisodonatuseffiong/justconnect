const pool = require("../config/db");

/**
 * ==============================================
 * BOOKING MODEL (INDUSTRY STANDARD UPGRADE)
 * Handles all database operations for bookings
 * ==============================================
 */

/* ============================================================
   🔹 Ensure the bookings table exists
   — Includes UNIQUE constraint to prevent double-booking
   — Prevents a professional from having two bookings same date/time
============================================================ */
const ensureBookingTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      professional_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      date DATE NOT NULL,
      time TIME NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_professional_time UNIQUE(professional_id, date, time)
    );
  `;
  try {
    await pool.query(query);
    console.log("📦 Bookings table verified.");
  } catch (error) {
    console.error("❌ Error ensuring bookings table:", error.message);
  }
};

/* ============================================================
   🔹 CHECK IF USER ALREADY BOOKED SAME TIME
============================================================ */
const userHasConflict = async (user_id, date, time) => {
  const q = `
    SELECT * FROM bookings
    WHERE user_id = $1 AND date = $2 AND time = $3
  `;
  const r = await pool.query(q, [user_id, date, time]);
  return r.rows.length > 0;
};

/* ============================================================
   🔹 CHECK IF PROFESSIONAL ALREADY BOOKED AT SAME TIME
============================================================ */
const professionalHasConflict = async (professional_id, date, time) => {
  const q = `
    SELECT * FROM bookings
    WHERE professional_id = $1 AND date = $2 AND time = $3
  `;
  const r = await pool.query(q, [professional_id, date, time]);
  return r.rows.length > 0;
};

/* ============================================================
   🔹 Create a new booking (with full industry checks)
============================================================ */
const createBooking = async (data) => {
  const { user_id, professional_id, service_id, date, time, notes } = data;

  // ❌ Cannot book past dates
  const nowDate = new Date().toISOString().split("T")[0];
  if (date < nowDate) {
    throw new Error("Cannot book for a past date");
  }

  // ❌ Check if USER already has a booking at same time
  const userConflict = await userHasConflict(user_id, date, time);
  if (userConflict) {
    throw new Error("You already have a booking at this time");
  }

  // ❌ Check if PROFESSIONAL is busy same time
  const proConflict = await professionalHasConflict(professional_id, date, time);
  if (proConflict) {
    throw new Error("Professional is not available at this time");
  }

  // 💾 Insert booking
  const query = `
    INSERT INTO bookings (user_id, professional_id, service_id, date, time, notes, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'pending')
    RETURNING *;
  `;
  const result = await pool.query(query, [
    user_id,
    professional_id,
    service_id,
    date,
    time,
    notes,
  ]);

  return result.rows[0];
};

/* ============================================================
   🔹 Get all bookings (ADMIN ONLY)
============================================================ */
const getAllBookings = async () => {
  const r = await pool.query(`
    SELECT * FROM bookings ORDER BY created_at DESC;
  `);
  return r.rows;
};

/* ============================================================
   🔹 Get bookings by user
============================================================ */
const getBookingsByUser = async (userId) => {
  const r = await pool.query(
    `SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC;`,
    [userId]
  );
  return r.rows;
};

/* ============================================================
   🔹 Get bookings by professional
============================================================ */
const getBookingsByProfessional = async (professionalId) => {
  const r = await pool.query(
    `SELECT * FROM bookings WHERE professional_id = $1 ORDER BY created_at DESC;`,
    [professionalId]
  );
  return r.rows;
};

/* ============================================================
   🔹 Update booking status (admin or professional)
============================================================ */
const updateBookingStatus = async (bookingId, status) => {
  const r = await pool.query(
    `
      UPDATE bookings
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `,
    [status, bookingId]
  );
  return r.rows[0];
};

/* ============================================================
   🔹 Delete booking (Admin or owner)
============================================================ */
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
