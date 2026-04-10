// controllers/adminController.js
const { pool } = require("../config/db");

/**
 * Dashboard statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    const [
      usersRes,
      prosRes,
      servicesRes,
      bookingsRes,
      pendingRes,
      completedRes,
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users"),
      pool.query("SELECT COUNT(*) FROM professionals"),
      pool.query("SELECT COUNT(*) FROM services"),
      pool.query("SELECT COUNT(*) FROM bookings"),
      pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'pending'"),
      pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'completed'"),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers: parseInt(usersRes.rows[0].count, 10),
        totalProfessionals: parseInt(prosRes.rows[0].count, 10),
        totalServices: parseInt(servicesRes.rows[0].count, 10),
        totalBookings: parseInt(bookingsRes.rows[0].count, 10),
        pendingBookings: parseInt(pendingRes.rows[0].count, 10),
        completedBookings: parseInt(completedRes.rows[0].count, 10),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching dashboard stats",
    });
  }
};


/**
 * Get all users
 */
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query =
      "SELECT id, name, email, role, created_at FROM users WHERE 1=1";

    const values = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (role) {
      query += ` AND role = $${paramIndex}`;
      values.push(role);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limitNum, offset);

    const usersRes = await pool.query(query, values);


    /* Count query */
    let countQuery = "SELECT COUNT(*) FROM users WHERE 1=1";
    const countValues = [];
    let countIndex = 1;

    if (search) {
      countQuery += ` AND (name ILIKE $${countIndex} OR email ILIKE $${countIndex})`;
      countValues.push(`%${search}%`);
      countIndex++;
    }

    if (role) {
      countQuery += ` AND role = $${countIndex}`;
      countValues.push(role);
      countIndex++;
    }

    const countRes = await pool.query(countQuery, countValues);
    const total = parseInt(countRes.rows[0].count, 10);

    res.status(200).json({
      success: true,
      data: {
        users: usersRes.rows,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching users",
    });
  }
};


/**
 * Delete user (cannot delete admin)
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 AND role != 'admin' RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or cannot delete admin",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting user",
    });
  }
};


/**
 * Get professionals
 */
const getAllProfessionals = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", service = "" } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = `
      SELECT 
      p.id,
      p.name,
      p.email,
      s.name AS service_name,
      p.location,
      p.experience,
      p.approved,
      p.created_at
      FROM professionals p
      LEFT JOIN services s 
      ON p.service_id = s.id
      WHERE 1=1
    `;

    const values = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (p.name ILIKE $${paramIndex} OR p.email ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (service) {
      query += ` AND s.name ILIKE $${paramIndex}`;
      values.push(`%${service}%`);
      paramIndex++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limitNum, offset);

    const prosRes = await pool.query(query, values);


    /* Count Query */
    let countQuery = `
      SELECT COUNT(*)
      FROM professionals p
      LEFT JOIN services s 
      ON p.service_id = s.id
      WHERE 1=1
    `;

    const countValues = [];
    let countIndex = 1;

    if (search) {
      countQuery += ` AND (p.name ILIKE $${countIndex} OR p.email ILIKE $${countIndex})`;
      countValues.push(`%${search}%`);
      countIndex++;
    }

    if (service) {
      countQuery += ` AND s.name ILIKE $${countIndex}`;
      countValues.push(`%${service}%`);
      countIndex++;
    }

    const countRes = await pool.query(countQuery, countValues);
    const total = parseInt(countRes.rows[0].count, 10);

    res.status(200).json({
      success: true,
      data: {
        professionals: prosRes.rows,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching professionals:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching professionals",
    });
  }
};


/**
 * Delete professional
 */
const deleteProfessional = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM professionals WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
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
    console.error("❌ Error deleting professional:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting professional",
    });
  }
};


/**
 * Approve professional
 */
const approveProfessional = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE professionals SET approved = true WHERE id = $1 RETURNING id, approved",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Professional approved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error approving professional:", error);
    res.status(500).json({
      success: false,
      message: "Server error approving professional",
    });
  }
};


/**
 * Get services
 */
const getAllServices = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM services ORDER BY name ASC"
    );

    res.status(200).json({
      success: true,
      data: { services: rows },
    });
  } catch (error) {
    console.error("❌ Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching services",
    });
  }
};


/**
 * Delete service
 */
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM services WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting service:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting service",
    });
  }
};


/**
 * Recent bookings
 */
const getRecentBookings = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
      b.id,
      b.status,
      b.created_at,
      u.name AS user_name,
      p.name AS professional_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN professionals p ON b.professional_id = p.id
      ORDER BY b.created_at DESC
      LIMIT 5
    `);

    res.status(200).json({
      success: true,
      data: { bookings: rows },
    });
  } catch (error) {
    console.error("❌ Error fetching recent bookings:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching recent bookings",
    });
  }
};


/**
 * Recent activity
 */
const getRecentActivity = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
      id,
      name,
      email,
      role,
      created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.status(200).json({
      success: true,
      data: { activity: rows },
    });
  } catch (error) {
    console.error("❌ Error fetching recent activity:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching recent activity",
    });
  }
};


module.exports = {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllProfessionals,
  deleteProfessional,
  approveProfessional,
  getAllServices,
  deleteService,
  getRecentBookings,
  getRecentActivity,
};