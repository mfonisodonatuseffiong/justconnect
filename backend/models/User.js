const pool = require("../config/db");

/**
 * ============================================
 * USER MODEL (FINAL PRODUCTION VERSION)
 * Handles all database operations for users
 * ============================================
 */

// ✅ Create a new user (supports user, professional, admin)
const addUser = async (name, email, password, role = "user") => {
  if (!email || !name || !password) {
    throw new Error("Missing required fields: name, email, or password");
  }

  const validRoles = ["user", "professional", "admin"];
  const finalRole = validRoles.includes(role.toLowerCase())
    ? role.toLowerCase()
    : "user";

  return pool.query(
    `INSERT INTO users (name, email, password, role, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING id, name, email, role`,
    [name.trim(), email.toLowerCase(), password, finalRole]
  );
};

// ✅ Fetch user by email (case-insensitive)
const getUserByEmail = async (email) => {
  return pool.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER($1)`,
    [email]
  );
};

// ✅ Fetch user by ID
const getUserById = async (id) => {
  return pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
};

// ✅ Update user password (after reset)
const updateUserPassword = async (userId, newPassword) => {
  return pool.query(
    `UPDATE users
     SET password = $1, updated_at = NOW()
     WHERE id = $2`,
    [newPassword, userId]
  );
};

// ✅ Save password reset token and expiry
const saveResetToken = async (userId, token, expiry) => {
  return pool.query(
    `UPDATE users
     SET reset_token = $1,
         reset_token_expiry = $2,
         updated_at = NOW()
     WHERE id = $3`,
    [token, expiry, userId]
  );
};

// ✅ Find user by valid reset token (not expired)
const findUserByResetToken = async (token) => {
  return pool.query(
    `SELECT * FROM users
     WHERE reset_token = $1
       AND reset_token_expiry > NOW()`,
    [token]
  );
};

// ✅ Clear password reset token after reset
const clearResetToken = async (userId) => {
  return pool.query(
    `UPDATE users
     SET reset_token = NULL,
         reset_token_expiry = NULL,
         updated_at = NOW()
     WHERE id = $1`,
    [userId]
  );
};

/**
 * ============================================
 * 🔄 REFRESH TOKEN MANAGEMENT
 * ============================================
 */

// ✅ Save refresh token for session renewal
const saveRefreshToken = async (userId, refreshToken) => {
  return pool.query(
    `UPDATE users
     SET refresh_token = $1,
         updated_at = NOW()
     WHERE id = $2`,
    [refreshToken, userId]
  );
};

// ✅ Fetch user by refresh token
const getUserByRefreshToken = async (token) => {
  return pool.query(
    `SELECT * FROM users WHERE refresh_token = $1`,
    [token]
  );
};

// ✅ Clear refresh token (on logout)
const clearRefreshToken = async (userId) => {
  return pool.query(
    `UPDATE users
     SET refresh_token = NULL,
         updated_at = NOW()
     WHERE id = $1`,
    [userId]
  );
};

module.exports = {
  addUser,
  getUserByEmail,
  getUserById,
  updateUserPassword,
  saveResetToken,
  findUserByResetToken,
  clearResetToken,
  saveRefreshToken,
  getUserByRefreshToken,
  clearRefreshToken,
};
