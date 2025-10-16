const pool = require("../../db");

/**
 * ============================================
 * USER MODEL (UPDATED)
 * Handles all database queries related to users
 * ============================================
 */

// ✅ Create new user (auto-validates role)
const addUser = async (name, email, password, role = "user") => {
  if (!email || !name || !password) {
    throw new Error("Missing required user fields: name, email, or password");
  }

  const validRoles = ["user", "professional"];
  const finalRole = validRoles.includes(role) ? role : "user";

  return pool.query(
    `INSERT INTO users (name, email, password, role, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING id, name, email, role`,
    [name, email, password, finalRole]
  );
};

// ✅ Fetch user by email (case insensitive)
const getUserByEmail = async (email) => {
  return pool.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [email]);
};

// ✅ Fetch user by ID
const getUserById = async (id) => {
  return pool.query("SELECT * FROM users WHERE id = $1", [id]);
};

// ✅ Update user password (also refresh updated_at)
const updateUserPassword = async (userId, newPassword) => {
  return pool.query(
    `UPDATE users
     SET password = $1, updated_at = NOW()
     WHERE id = $2`,
    [newPassword, userId]
  );
};

// ✅ Save password reset token + expiry
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

// ✅ Find user by active reset token (not expired)
const findUserByResetToken = async (token) => {
  return pool.query(
    `SELECT * FROM users
     WHERE reset_token = $1
       AND reset_token_expiry > NOW()`,
    [token]
  );
};

// ✅ Clear token after successful reset
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

// ✅ Save a new refresh token
const saveRefreshToken = async (userId, refreshToken) => {
  return pool.query(
    `UPDATE users
     SET refresh_token = $1,
         updated_at = NOW()
     WHERE id = $2`,
    [refreshToken, userId]
  );
};

// ✅ Get user by refresh token
const getUserByRefreshToken = async (token) => {
  return pool.query(
    `SELECT * FROM users
     WHERE refresh_token = $1`,
    [token]
  );
};

// ✅ Clear refresh token (on logout or rotation)
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
