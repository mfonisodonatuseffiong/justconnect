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

// ✅ Get all services (return plain array for dropdown)
router.get("/", async (req, res) => {
  try {
    const services = await Service.getAll();
    res.status(200).json(services); // <-- return array directly
  } catch (err) {
    console.error("❌ Error fetching services:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get single service by ID
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.getById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json(service); // <-- return object directly
  } catch (err) {
    console.error("❌ Error fetching service:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get professionals linked to a service with filters, search, and pagination
router.get("/:serviceId/professionals", authenticateToken, async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { page = 1, limit = 12, category = "", location = "", search = "" } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT id, name, email, contact, location, experience, rating, category, avatar
                 FROM professionals
                 WHERE service_id = $1`;
    const params = [serviceId];
    let paramIndex = 2;

    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    if (location) {
      query += ` AND location = $${paramIndex}`;
      params.push(location);
      paramIndex++;
    }
    if (search) {
      query += ` AND LOWER(name) LIKE $${paramIndex}`;
      params.push(`%${search.toLowerCase()}%`);
      paramIndex++;
    }

    query += ` ORDER BY id ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.status(200).json(result.rows);
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

// Admin: Create new service
adminRouter.post("/", authenticateToken, authorizeRoles("admin"), validateService, async (req, res) => {
  try {
    const service = await Service.create(req.body.name);
    res.status(201).json(service); // <-- return object directly
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
    res.status(200).json(service);
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

router.use("/admin", adminRouter);

module.exports = router;
