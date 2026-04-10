/**
 * User model helpers – NO REFRESH TOKEN VERSION
 * - Secure parameterized queries
 * - Clean + simplified
 */

const { pool } = require("../config/db");

/**
 *@description Create a new user  ---
 */

async function addUser({ name, email, password, role, location }) {
  const query = `
  INSERT INTO users (name, email, password, role, location)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id, name, email, role, location
  `;
  const values = [name, email, password, role, location || null];
  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * @description Create a new professional details ---
 */

async function createProfessional({
  user_id,
  category_id,
  service_area = null,
}) {
  const query = `
    INSERT INTO professionals (user_id, category_id, service_area )
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const values = [user_id, category_id, service_area];
  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * @description Checks if the email exist already in database.
 *              Built mainly for the registration controller ---
 */
async function checkEmailExists(email) {
  const { rows } = await pool.query(
    `SELECT id
     FROM users
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email],
  );

  return rows.length > 0;
}

/**
 * getUserByEmail(email)
 * Includes password (for login) + reset token fields
 */
async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, name, email, password, role,
            profile_picture, phone, sex, address,
            reset_token, reset_token_expiry
     FROM users
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email],
  );

  return rows[0] || null;
}

/**
 * getUserById(id)
 * Public profile (no password)
 */
async function getUserById(id) {
  const { rows } = await pool.query(
    `SELECT id, name, email, role,
            profile_picture, phone, sex, address
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id],
  );

  return rows[0] || null;
}

/**
 * Update user password
 */
async function updateUserPassword(userId, hashedPassword) {
  await pool.query(
    `UPDATE users
     SET password = $1, updated_at = NOW()
     WHERE id = $2`,
    [hashedPassword, userId],
  );
}

/**
 * Save a reset token for password reset
 */
async function saveResetToken(userId, hashedToken, expiryDate) {
  await pool.query(
    `UPDATE users
     SET reset_token = $1,
         reset_token_expiry = $2,
         updated_at = NOW()
     WHERE id = $3`,
    [hashedToken, expiryDate, userId],
  );
}

/**
 * Fetch user by valid reset token
 */
async function findUserByResetToken(hashedToken) {
  const { rows } = await pool.query(
    `SELECT id, name, email, role
     FROM users
     WHERE reset_token = $1
       AND reset_token_expiry IS NOT NULL
       AND reset_token_expiry > NOW()
     LIMIT 1`,
    [hashedToken],
  );

  return rows[0] || null;
}

/**
 * Clear password reset token
 */
async function clearResetToken(userId) {
  await pool.query(
    `UPDATE users
     SET reset_token = NULL,
         reset_token_expiry = NULL,
         updated_at = NOW()
     WHERE id = $1`,
    [userId],
  );
}

/**
 * Update user profile picture
 */
async function updateUserProfilePic(userId, url) {
  const { rows } = await pool.query(
    `UPDATE users
     SET profile_picture = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING id, name, email, role,
               profile_picture, phone, sex, address`,
    [url, userId],
  );

  return rows[0];
}

module.exports = {
  addUser,
  createProfessional,
  checkEmailExists,
  getUserByEmail,
  getUserById,
  updateUserPassword,
  saveResetToken,
  findUserByResetToken,
  clearResetToken,
  updateUserProfilePic,
};
