// src/controllers/userController.js
const { pool } = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/* ======================================================
   Generate JWT
====================================================== */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile_picture: user.profile_picture,
      phone: user.phone,
      location: user.location,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/* ======================================================
   Register new user
====================================================== */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, location, sex } = req.body;

    // Check if email exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, phone, location, sex, created_at, updated_at)
       VALUES ($1, $2, $3, 'user', $4, $5, $6, NOW(), NOW())
       RETURNING id, name, email, role, profile_picture, phone, location, sex`,
      [name, email, hashedPassword, phone, location, sex]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ success: false, message: "Server error registering user" });
  }
};

/* ======================================================
   Login user
====================================================== */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      `SELECT id, name, email, role, password, profile_picture, phone, location, sex
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Remove password before sending back
    delete user.password;

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ success: false, message: "Server error logging in" });
  }
};

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

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserSettings,
};
