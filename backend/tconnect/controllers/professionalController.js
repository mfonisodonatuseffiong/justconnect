const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../../db");

/**
 * 🟢 Register a new professional
 */
exports.registerProfessional = async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      category,
      password,
      location,
      latitude,
      longitude,
      experience,
      rating,
    } = req.body;

    // Basic field validation
    if (!name || !email || !contact || !category || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields (name, email, contact, category, password) must be filled.",
      });
    }

    // Check for existing email
    const existing = await pool.query(
      "SELECT * FROM professionals WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new professional
    const result = await pool.query(
      `INSERT INTO professionals
      (name, email, contact, category, password, location, latitude, longitude, experience, rating)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id, name, email, contact, category, location, experience, rating`,
      [
        name,
        email,
        contact,
        category,
        hashedPassword,
        location || null,
        latitude || null,
        longitude || null,
        experience || 0,
        rating || 0.0,
      ]
    );

    const professional = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: professional.id, email: professional.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Professional registered successfully",
      token,
      professional,
    });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * 🟠 Login a professional
 */
exports.loginProfessional = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const result = await pool.query(
      "SELECT * FROM professionals WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Professional not found" });
    }

    const professional = result.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, professional.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate new token
    const token = jwt.sign(
      { id: professional.id, email: professional.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      professional: {
        id: professional.id,
        name: professional.name,
        email: professional.email,
        contact: professional.contact,
        category: professional.category,
        location: professional.location,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * 🟣 Get all professionals
 */
exports.getAllProfessionals = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, contact, category, location, experience, rating FROM professionals ORDER BY id DESC"
    );

    res.status(200).json({
      success: true,
      count: result.rowCount,
      professionals: result.rows,
    });
  } catch (error) {
    console.error("❌ Error fetching professionals:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
