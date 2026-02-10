// controllers/adminController.js
const pool = require("../config/db");

/**
 * Get dashboard statistics for admin overview
 * @route GET /api/v1/admin/stats
 * @access Private (Admin only)
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
    console.error("❌ Error fetching admin dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics. Please try again later.",
    });
  }
};

/**
 * Get all users (paginated, searchable, filter by role)
 * @route GET /api/v1/admin/users
 */
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;
    const offset = (page - 1) * limit;

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

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${
      paramIndex + 1
    }`;
    values.push(limit, offset);

    const usersRes = await pool.query(query, values);
    const countRes = await pool.query("SELECT COUNT(*) FROM users");
    const total = parseInt(countRes.rows[0].count, 10);

    res.status(200).json({
      success: true,
      users: usersRes.rows,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching users" });
  }
};

/**
 * Delete a user by ID
 * @route DELETE /api/v1/admin/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error deleting user" });
  }
};

/**
 * Get all professionals
 * @route GET /api/v1/admin/professionals
 */
const getAllProfessionals = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", service = "" } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.id, p.name, p.email, s.name AS service_name,
             p.location, p.experience, p.approved
      FROM professionals p
      LEFT JOIN services s ON p.service_id = s.id
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

    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${
      paramIndex + 1
    }`;
    values.push(limit, offset);

    const prosRes = await pool.query(query, values);
    const countRes = await pool.query("SELECT COUNT(*) FROM professionals");
    const total = parseInt(countRes.rows[0].count, 10);

    res.status(200).json({
      success: true,
      professionals: prosRes.rows,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
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
 * Delete a professional by ID
 * @route DELETE /api/v1/admin/professionals/:id
 */
const deleteProfessional = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM professionals WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Professional not found" });
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
 * Approve a professional by ID
 * @route PUT /api/v1/admin/professionals/:id/approve
 */
const approveProfessional = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE professionals SET approved = true WHERE id = $1 RETURNING id, approved",
      [id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Professional not found" });
    }

    res.status(200).json({
      success: true,
      message: "Professional approved successfully",
      professional: result.rows[0],
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
 * Get all services
 * @route GET /api/v1/admin/services
 */
const getAllServices = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM services ORDER BY name ASC"
    );
    res.status(200).json({ success: true, services: rows });
  } catch (error) {
    console.error("❌ Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching services",
    });
  }
};

/**
 * Delete a service by ID
 * @route DELETE /api/v1/admin/services/:id
 */
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM services WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
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
 * Get recent bookings (latest 5)
 * @route GET /api/v1/admin/recent-bookings
 */
const getRecentBookings = async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT b.id, b.status, b.created_at, u.name AS user_name, p.name AS professional_name
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN professionals p ON b.professional_id = p.id
        ORDER BY b.created_at DESC
        LIMIT 5
      `);
  
      res.status(200).json({ success: true, bookings: rows });
    } catch (error) {
      console.error("❌ Error fetching recent bookings:", error);
      res.status(500).json({ success: false, message: "Server error fetching recent bookings" });
    }
  };
  
  /**
   * Get recent user registrations (latest 5)
   * @route GET /api/v1/admin/recent-activity
   */
  const getRecentActivity = async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT id, name, email, role, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 5
      `);
  
      res.status(200).json({ success: true, activity: rows });
    } catch (error) {
      console.error("❌ Error fetching recent activity:", error);
      res.status(500).json({ success: false, message: "Server error fetching recent activity" });
    }
  };
  

/* =====================================================
 * EXPORTS
 * ===================================================== */
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
