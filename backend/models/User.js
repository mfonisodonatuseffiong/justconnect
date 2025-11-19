// models/User.js
/**
 * User model helpers
 * - Uses parameterized queries only
 * - Returns single rows where appropriate
 * - Implements refresh token + reset token helpers
 */

const pool = require("../config/db");

/**
 * Create a new user
 * Signature kept compatible with existing controller calls:
 *   addUser(name, email, password, role, profile_pic, sex)
 * Returns created user row (including id, name, email, role, phone, address, sex, profile_pic)
 */
async function addUser(name, email, password, role = "user", profile_pic = null, sex = null, phone = null, address = null) {
  const query = `
    INSERT INTO users (name, email, password, role, phone, address, sex, profile_pic, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8, NOW(), NOW())
    RETURNING id, name, email, role, phone, address, sex, profile_pic;
  `;
  const values = [name, email, password, role, phone, address, sex, profile_pic];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

/**
 * getUserByEmail(email)
 * Returns full user row (including password and refresh_token) — used for auth/login
 */
async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, name, email, password, role, phone, address, sex, profile_pic, refresh_token, reset_token, reset_token_expiry
     FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

/**
 * getUserById(id)
 * Returns non-sensitive profile fields (no password)
 */
async function getUserById(id) {
  const { rows } = await pool.query(
    `SELECT id, name, email, role, phone, address, sex, profile_pic, refresh_token
     FROM users WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

/**
 * updateUserPassword(userId, hashedPassword)
 */
async function updateUserPassword(userId, hashedPassword) {
  await pool.query(
    `UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2`,
    [hashedPassword, userId]
  );
}

/**
 * saveResetToken(userId, hashedToken, expiryDate)
 * - hashedToken expected to be SHA256 hashed token
 * - expiryDate is a JS Date (or ISO string) — stored as timestamptz
 */
async function saveResetToken(userId, hashedToken, expiryDate) {
  await pool.query(
    `UPDATE users SET reset_token = $1, reset_token_expiry = $2, updated_at = NOW() WHERE id = $3`,
    [hashedToken, expiryDate, userId]
  );
}

/**
 * findUserByResetToken(hashedToken)
 * Returns user row only if token matches and is not expired
 */
async function findUserByResetToken(hashedToken) {
  const { rows } = await pool.query(
    `SELECT id, name, email, role FROM users
     WHERE reset_token = $1
       AND reset_token_expiry IS NOT NULL
       AND reset_token_expiry > NOW()
     LIMIT 1`,
    [hashedToken]
  );
  return rows[0] || null;
}

/**
 * clearResetToken(userId)
 */
async function clearResetToken(userId) {
  await pool.query(
    `UPDATE users SET reset_token = NULL, reset_token_expiry = NULL, updated_at = NOW() WHERE id = $1`,
    [userId]
  );
}

/**
 * saveRefreshToken(userId, refreshToken)
 * Also stores updated_at
 */
async function saveRefreshToken(userId, refreshToken) {
  await pool.query(
    `UPDATE users SET refresh_token = $1, updated_at = NOW() WHERE id = $2`,
    [refreshToken, userId]
  );
}

/**
 * getUserByRefreshToken(refreshToken)
 * Returns full user row (id, name, email, role, etc.)
 */
async function getUserByRefreshToken(refreshToken) {
  const { rows } = await pool.query(
    `SELECT id, name, email, role, refresh_token FROM users WHERE refresh_token = $1 LIMIT 1`,
    [refreshToken]
  );
  return rows[0] || null;
}

/**
 * clearRefreshToken(userId)
 */
async function clearRefreshToken(userId) {
  await pool.query(
    `UPDATE users SET refresh_token = NULL, updated_at = NOW() WHERE id = $1`,
    [userId]
  );
}

/**
 * updateRefreshToken(userId, refreshToken)
 * Alias to saveRefreshToken — kept for compatibility with earlier suggestions
 */
const updateRefreshToken = saveRefreshToken;

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
  updateRefreshToken,
};
