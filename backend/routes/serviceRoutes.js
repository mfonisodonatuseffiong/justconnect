const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");
const { Service } = require("../models/ServiceModel");
const pool = require("../config/db");

/**
 * ==========================================================
 * SERVICE & ADMIN ROUTES
 * Handles CRUD for services + admin controls
 * ==========================================================
 */

/* ===========================
   🟢 USER-FACING ROUTES
=========================== */

// ✅ Get all services
router.get("/", authenticateToken, async (req, res) => {
  try {
    const services = await Service.getAll();
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (err) {
    console.error("❌ Error fetching services:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get a single service by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const service = await Service.getById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    console.error("❌ Error fetching service:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get professionals linked to a specific service
router.get("/:serviceId/professionals", authenticateToken, async (req, res) => {
  try {
    const { serviceId } = req.params;

    const result = await pool.query(
      `SELECT id, name, email, contact, location, experience, rating
       FROM professionals
       WHERE service_id = $1`,
      [serviceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No professionals found for this service",
      });
    }

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error fetching professionals:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===========================
   🔐 ADMIN PANEL ROUTES
=========================== */

// 👑 Admin: Dashboard overview (users + professionals + services)
router.get("/admin/overview", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const [servicesResult, prosResult, usersResult, reportsResult] = await Promise.all([
      pool.query("SELECT id, name FROM services ORDER BY id ASC"),
      pool.query("SELECT id, name, email, service_id, rating FROM professionals ORDER BY id ASC"),
      pool.query("SELECT id, name, email, role FROM users ORDER BY id ASC"),
      pool.query("SELECT id, user_id, professional_id, description, created_at FROM reports ORDER BY created_at DESC")
    ]);

    res.status(200).json({
      success: true,
      totals: {
        services: servicesResult.rows.length,
        professionals: prosResult.rows.length,
        users: usersResult.rows.length,
        reports: reportsResult.rows.length
      },
      data: {
        services: servicesResult.rows,
        professionals: prosResult.rows,
        users: usersResult.rows,
        reports: reportsResult.rows
      }
    });
  } catch (err) {
    console.error("❌ Error fetching admin overview:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 👑 Admin: Get all users
router.get("/admin/users", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC"
    );
    res.status(200).json({ success: true, count: users.rows.length, data: users.rows });
  } catch (err) {
    console.error("❌ Error fetching users:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 👑 Admin: Get all professionals
router.get("/admin/professionals", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const pros = await pool.query(
      "SELECT id, name, email, contact, location, category, service_id, rating FROM professionals ORDER BY id DESC"
    );
    res.status(200).json({ success: true, count: pros.rows.length, data: pros.rows });
  } catch (err) {
    console.error("❌ Error fetching professionals:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 👑 Admin: Get all reports
router.get("/admin/reports", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const reports = await pool.query(
      "SELECT id, user_id, professional_id, description, created_at FROM reports ORDER BY created_at DESC"
    );
    res.status(200).json({ success: true, count: reports.rows.length, data: reports.rows });
  } catch (err) {
    console.error("❌ Error fetching reports:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🟡 Create new service
router.post("/", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    const service = await Service.create(name);
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    console.error("❌ Error creating service:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🟠 Update existing service
router.put("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name } = req.body;
    const service = await Service.update(req.params.id, name);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    console.error("❌ Error updating service:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔴 Delete service
router.delete("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const deleted = await Service.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting service:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
