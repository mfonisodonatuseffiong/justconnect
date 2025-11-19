const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");
const { Service } = require("../models/ServiceModel");

/**
 * ==========================================================
 * Middleware: Validate Service Input
 * ==========================================================
 */
const validateService = (req, res, next) => {
  const { name } = req.body;
  if (!name || typeof name !== "string" || name.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Invalid service name. Must be at least 3 characters.",
    });
  }
  next();
};

/**
 * ==========================================================
 * USER-FACING ROUTES
 * ==========================================================
 */

// Get all services with optional pagination
router.get("/", authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const services = await Service.getAll(limit, offset);
    const total = await Service.countAll();

    res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      count: services.length,
      total,
      page,
      limit,
      data: services,
    });
  } catch (err) {
    console.error("❌ Error fetching services:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get single service by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const service = await Service.getById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, message: "Service fetched successfully", data: service });
  } catch (err) {
    console.error("❌ Error fetching service:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get professionals linked to a service
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

/**
 * ==========================================================
 * ADMIN ROUTES
 * ==========================================================
 */
const adminRouter = express.Router();

// Admin: Dashboard overview
adminRouter.get("/overview", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const [servicesResult, prosResult, usersResult, reportsResult] = await Promise.all([
      pool.query("SELECT id, name FROM services ORDER BY id ASC"),
      pool.query("SELECT id, name, email, service_id, rating FROM professionals ORDER BY id ASC"),
      pool.query("SELECT id, name, email, role FROM users ORDER BY id ASC"),
      pool.query("SELECT id, user_id, professional_id, description, created_at FROM reports ORDER BY created_at DESC"),
    ]);

    res.status(200).json({
      success: true,
      totals: {
        services: servicesResult.rows.length,
        professionals: prosResult.rows.length,
        users: usersResult.rows.length,
        reports: reportsResult.rows.length,
      },
      data: {
        services: servicesResult.rows,
        professionals: prosResult.rows,
        users: usersResult.rows,
        reports: reportsResult.rows,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching admin overview:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin: Create new service
adminRouter.post("/", authenticateToken, authorizeRoles("admin"), validateService, async (req, res) => {
  try {
    const service = await Service.create(req.body.name);
    res.status(201).json({ success: true, message: "Service created successfully", data: service });
  } catch (err) {
    console.error("❌ Error creating service:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin: Update existing service
adminRouter.put("/:id", authenticateToken, authorizeRoles("admin"), validateService, async (req, res) => {
  try {
    const service = await Service.update(req.params.id, req.body.name);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, message: "Service updated successfully", data: service });
  } catch (err) {
    console.error("❌ Error updating service:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin: Delete service
adminRouter.delete("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
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

// Mount admin routes at /admin
router.use("/admin", adminRouter);

module.exports = router;
