const pool = require("../config/db");

/**
 * ==========================================================
 * SERVICES CONTROLLER
 * Handles creating, fetching, updating, and deleting services
 * ==========================================================
 */

// ✅ Create a new service (Admin only)
const createService = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can add services.",
      });
    }

    const { name, description, price } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Service name is required." });
    }

    const result = await pool.query(
      "INSERT INTO services(name, description, price) VALUES($1, $2, $3) RETURNING *",
      [name.trim(), description || "", price || 0]
    );

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: result.rows[0],
    });
  } catch (err) {
    if (err.message.includes("duplicate key")) {
      return res.status(400).json({ success: false, message: "Service already exists." });
    }
    console.error("❌ Error creating service:", err.message);
    res.status(500).json({ success: false, message: "Server error creating service." });
  }
};

// ✅ Get all services (with search + pagination)
const getAllServices = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM services WHERE 1=1";
    const params = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      query += ` AND LOWER(name) LIKE $${params.length}`;
    }

    query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Count total results
    let countQuery = "SELECT COUNT(*) FROM services WHERE 1=1";
    const countParams = [];
    if (search) {
      countParams.push(`%${search.toLowerCase()}%`);
      countQuery += ` AND LOWER(name) LIKE $${countParams.length}`;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count, 10);

    res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error fetching services:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching services." });
  }
};

// ✅ Get service by ID
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM services WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    res.status(200).json({
      success: true,
      message: "Service fetched successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error fetching service by ID:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching service." });
  }
};

// ✅ Update service (Admin only)
const updateService = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can update services.",
      });
    }

    const { id } = req.params;
    const { name, description, price } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Service name is required." });
    }

    const result = await pool.query(
      "UPDATE services SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *",
      [name.trim(), description || "", price || 0, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error updating service:", err.message);
    res.status(500).json({ success: false, message: "Server error updating service." });
  }
};

// ✅ Delete service (Admin only)
const deleteService = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can delete services.",
      });
    }

    const { id } = req.params;
    const result = await pool.query("DELETE FROM services WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error deleting service:", err.message);
    res.status(500).json({ success: false, message: "Server error deleting service." });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
