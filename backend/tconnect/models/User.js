const pool = require("../../db");

// ✅ Add new user
const addUser = async (name, email, password, role = "user") => {
  return pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
    [name, email, password, role]
  );
};

// ✅ Get user by email
const getUserByEmail = async (email) => {
  return pool.query("SELECT * FROM users WHERE email = $1", [email]);
};

// ✅ Update password
const updateUserPassword = async (userId, newPassword) => {
  return pool.query("UPDATE users SET password = $1 WHERE id = $2", [
    newPassword,
    userId,
  ]);
};

// ✅ Save reset token + expiry
const saveResetToken = async (userId, token, expiry) => {
  return pool.query(
    "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3",
    [token, expiry, userId]
  );
};

// ✅ Find user by reset token
const findUserByResetToken = async (token) => {
  return pool.query(
    "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()",
    [token]
  );
};

// ✅ Clear reset token after password reset
const clearResetToken = async (userId) => {
  return pool.query(
    "UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = $1",
    [userId]
  );
};

module.exports = {
  addUser,
  getUserByEmail,
  updateUserPassword,
  saveResetToken,
  findUserByResetToken,
  clearResetToken,
};
