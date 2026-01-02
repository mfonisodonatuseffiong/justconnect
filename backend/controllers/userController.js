// src/controllers/userController.js
const pool = require("../config/db");

/* ======================================================
   Get user profile
====================================================== */
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, name, email, role, profile_picture, sex, location, phone
       FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ success: false, message: "Server error fetching profile" });
  }
};

/* ======================================================
   Update user settings
   (Preserve profile_picture if not provided)
====================================================== */
const updateUserSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, profile_picture, location, phone } = req.body;

    // Fetch current profile picture to preserve if not sent
    const current = await pool.query(
      `SELECT profile_picture FROM users WHERE id = $1`,
      [id]
    );
    const existingPicture = current.rows[0]?.profile_picture;

    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           email = $2,
           profile_picture = $3,
           location = $4,
           phone = $5,
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, name, email, role, profile_picture, sex, location, phone`,
      [
        name,
        email,
        profile_picture ?? existingPicture, // ✅ keep old picture if not sent
        location,
        phone,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Settings updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating settings:", error.message);
    res.status(500).json({ success: false, message: "Server error updating settings" });
  }
};

module.exports = { getUserProfile, updateUserSettings };
