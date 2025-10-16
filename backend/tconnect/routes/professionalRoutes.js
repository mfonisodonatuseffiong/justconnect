// backend/routes/professionalRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  Professional,
  ensureProfessionalTable,
  getFiltered,
} = require("../models/professionalModel");

// Ensure the table exists
ensureProfessionalTable();

/**
 * ============================================
 * PROFESSIONAL ROUTES
 * Handles registration, fetching, updating & deletion
 * ============================================
 */

// 🟢 REGISTER a new professional
router.post("/register", async (req, res) => {
  try {
    const { name, email, contact, category, location, password } = req.body;

    if (!name || !email || !category || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, category, and password are required",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newProfessional = await Professional.create({
      name,
      email,
      contact,
      category,
      location,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign(
      { id: newProfessional.id, email: newProfessional.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Professional registered successfully",
      token,
      professional: newProfessional,
    });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);

    if (error.message.includes("duplicate key")) {
      return res.status(400).json({
        success: false,
        message: "Professional with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

// 🟣 GET all professionals or filter by category/location
router.get("/", async (req, res) => {
  try {
    const { category, location } = req.query;
    const filters = {};

    if (category) filters.category = category;
    if (location) filters.location = location;

    const professionals =
      Object.keys(filters).length > 0
        ? await getFiltered(filters)
        : await Professional.getAll();

    res.status(200).json({
      success: true,
      message: "Professionals fetched successfully",
      count: professionals.length,
      professionals,
    });
  } catch (error) {
    console.error("❌ Error fetching professionals:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching professionals",
    });
  }
});

// 🔵 GET a professional by ID
router.get("/:id", async (req, res) => {
  try {
    const professional = await Professional.getById(req.params.id);

    if (!professional) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Professional fetched successfully",
      professional,
    });
  } catch (error) {
    console.error("❌ Error fetching professional:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching professional",
    });
  }
});

// 🟠 UPDATE professional details
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const updated = await Professional.update(req.params.id, updates);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Professional updated successfully",
      professional: updated,
    });
  } catch (error) {
    console.error("❌ Error updating professional:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error updating professional",
    });
  }
});

// 🔴 DELETE a professional
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Professional.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Professional deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting professional:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error deleting professional",
    });
  }
});

module.exports = router;
