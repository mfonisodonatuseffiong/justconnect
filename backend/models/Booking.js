// models/Booking.js
const {pool} = require("../config/db");

/**
 * ==============================================
 * BOOKING MODEL
 * Handles all database operations for bookings
 * ==============================================
 */

/* ============================================================
   Ensure the bookings table exists
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
   CHECK IF USER ALREADY BOOKED SAME TIME
============================================================ */
const userHasConflict = async (user_id, date, time) => {
  const q = `
    SELECT 1 FROM bookings
    WHERE user_id = $1 AND date = $2 AND time = $3
    LIMIT 1;
  `;
  const r = await pool.query(q, [user_id, date, time]);
  return r.rows.length > 0;
};

/* ============================================================
   CHECK IF PROFESSIONAL ALREADY BOOKED AT SAME TIME
============================================================ */
const professionalHasConflict = async (professional_id, date, time) => {
  const q = `
    SELECT 1 FROM bookings
    WHERE professional_id = $1 AND date = $2 AND time = $3
    LIMIT 1;
  `;
  const r = await pool.query(q, [professional_id, date, time]);
  return r.rows.length > 0;
};

/* ============================================================
   Create a new booking
============================================================ */
const createBooking = async (data) => {
  const { user_id, professional_id, service_id, date, time, notes } = data;

  const nowDate = new Date().toISOString().split("T")[0];
  if (date < nowDate) {
    throw new Error("Cannot book for a past date");
  }

  const userConflict = await userHasConflict(user_id, date, time);
  if (userConflict) {
    throw new Error("You already have a booking at this time");
  }

  const proConflict = await professionalHasConflict(professional_id, date, time);
  if (proConflict) {
    throw new Error("Professional is not available at this time");
  }

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
   Get all bookings (ADMIN)
   Joins users and professionals for contextual info
   Select only columns that exist in both schemas to avoid errors
============================================================ */
const getAllBookings = async () => {
  try {
    const r = await pool.query(`
      SELECT 
        b.*,

        u.name AS client_name,
        u.email AS client_email,
        u.phone AS client_phone,
        u.location AS client_location,
        u.address AS client_address,
        u.sex AS client_sex,
        u.profile_picture AS client_profile_picture,

        p.name AS professional_name,
        p.email AS professional_email,
        p.phone AS professional_phone,
        p.location AS professional_location,
        p.contact AS professional_contact,
        p.photo AS professional_photo,
        p.profile_photo_url AS professional_profile_photo_url

      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN professionals p ON b.professional_id = p.id
      ORDER BY b.created_at DESC;
    `);

    return r.rows;
  } catch (err) {
    console.error("getAllBookings ERROR:", err && err.stack ? err.stack : err);
    throw err;
  }
};

/* ============================================================
   Get bookings by user
   Join to professionals table for professional details
   Wrapped with logging and error handling to reveal SQL/runtime errors
   Select only safe columns present in professionals table
============================================================ */
const getBookingsByUser = async (userId) => {
  try {
    console.log("getBookingsByUser called with userId:", userId);
    const r = await pool.query(
      `
      SELECT 
        b.*,

        p.name AS professional_name,
        p.email AS professional_email,
        p.phone AS professional_phone,
        p.location AS professional_location,
        p.contact AS professional_contact,
        p.photo AS professional_photo,
        p.profile_photo_url AS professional_profile_photo_url

      FROM bookings b
      LEFT JOIN professionals p ON b.professional_id = p.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC;
    `,
      [userId]
    );
    console.log("getBookingsByUser returned rows:", r.rows?.length ?? 0);
    return r.rows;
  } catch (err) {
    console.error("getBookingsByUser ERROR:", err && err.stack ? err.stack : err);
    throw err;
  }
};

/* ============================================================
   Get bookings by professional
   Returns full client details
   Select only safe user columns
============================================================ */
const getBookingsByProfessional = async (professionalId) => {
  try {
    const r = await pool.query(
      `
      SELECT 
        b.*,

        u.id AS client_id,
        u.name AS client_name,
        u.email AS client_email,
        u.phone AS client_phone,
        u.location AS client_location,
        u.address AS client_address,
        u.sex AS client_sex,
        u.profile_picture AS client_profile_picture

      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.professional_id = $1
        AND b.status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')
      ORDER BY 
        CASE 
          WHEN b.status = 'pending' THEN 1
          WHEN b.status = 'accepted' THEN 2
          WHEN b.status = 'in_progress' THEN 3
          WHEN b.status = 'completed' THEN 4
          WHEN b.status = 'cancelled' THEN 5
          ELSE 6
        END,
        b.created_at DESC;
    `,
      [professionalId]
    );
    return r.rows;
  } catch (err) {
    console.error("getBookingsByProfessional ERROR:", err && err.stack ? err.stack : err);
    throw err;
  }
};

/* ============================================================
   Get single booking by id (useful for confirmation page)
   Joins both user and professional tables for consistent enrichment
   Select only safe columns from professionals
============================================================ */
const getBookingById = async (bookingId) => {
  try {
    const r = await pool.query(
      `
      SELECT
        b.*,
        u.id AS client_id,
        u.name AS client_name,
        u.email AS client_email,
        u.phone AS client_phone,
        u.location AS client_location,
        u.address AS client_address,
        u.sex AS client_sex,
        u.profile_picture AS client_profile_picture,

        p.name AS professional_name,
        p.email AS professional_email,
        p.phone AS professional_phone,
        p.location AS professional_location,
        p.contact AS professional_contact,
        p.photo AS professional_photo,
        p.profile_photo_url AS professional_profile_photo_url

      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN professionals p ON b.professional_id = p.id
      WHERE b.id = $1
      LIMIT 1;
    `,
      [bookingId]
    );

    return r.rows[0] || null;
  } catch (err) {
    console.error("getBookingById ERROR:", err && err.stack ? err.stack : err);
    throw err;
  }
};

/* ============================================================
   Update booking status
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
   Delete booking
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
  getBookingById,
  updateBookingStatus,
  deleteBooking,
};
