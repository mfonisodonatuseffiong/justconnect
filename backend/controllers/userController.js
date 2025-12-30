const pool = require("../config/db");

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, name, email, role, profile_pic, location, contact
       FROM users WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ profile: result.rows[0] });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// Update user settings
const updateUserSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, profile_pic, location, contact } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2, profile_pic = $3, location = $4, contact = $5
       WHERE id = $6
       RETURNING id, name, email, profile_pic, location, contact`,
      [name, email, profile_pic, location, contact, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Settings updated successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error updating settings:", error.message);
    res.status(500).json({ message: "Server error updating settings" });
  }
};

module.exports = { getUserProfile, updateUserSettings };
