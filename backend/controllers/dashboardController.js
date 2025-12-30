const pool = require("../config/db");

/**
 * ==========================================================
 * DASHBOARD CONTROLLERS
 * ==========================================================
 */

// 🧭 Unified dashboard (auto-detect role: user/professional/admin)
const getDashboard = async (req, res) => {
  // Keep your existing unified logic here
};

// 🧰 Professional dashboard
const getProfessionalDashboard = async (req, res) => {
  // Keep your existing professional logic here
};

// 🆕 User dashboard (with userId param)
const getUserDashboard = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "user") {
      return res.status(403).json({ message: "Access denied. Users only." });
    }

    // ✅ Use userId from route params
    const userId = parseInt(req.params.userId, 10);
    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Requests
    const requestsResult = await pool.query(
      `SELECT r.*, p.name AS professional_name, p.category AS professional_field
       FROM requests r
       LEFT JOIN professionals p ON r.professional_id = p.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    // Request stats
    const statsResult = await pool.query(
      `SELECT 
         COUNT(*) AS total,
         COUNT(*) FILTER (WHERE status='pending') AS pending,
         COUNT(*) FILTER (WHERE status='in_progress') AS in_progress,
         COUNT(*) FILTER (WHERE status='completed') AS completed
       FROM requests WHERE user_id = $1`,
      [userId]
    );

    // Weekly requests
    const weeklyRequestsResult = await pool.query(
      `SELECT 
         TO_CHAR(date_trunc('day', created_at), 'Dy') AS day,
         COUNT(*) AS count
       FROM requests
       WHERE user_id = $1
         AND created_at >= date_trunc('week', CURRENT_DATE)
       GROUP BY day
       ORDER BY day`,
      [userId]
    );

    // Booking status (grouped)
    const bookingStatusResult = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM bookings
       WHERE user_id = $1
       GROUP BY status`,
      [userId]
    );

    // 🆕 Total bookings
    const totalBookingsResult = await pool.query(
      `SELECT COUNT(*) AS total_bookings
       FROM bookings
       WHERE user_id = $1`,
      [userId]
    );

    // 🆕 Messages count
    const messagesResult = await pool.query(
      `SELECT COUNT(*) AS total_messages
       FROM messages
       WHERE receiver_id = $1`,
      [userId]
    );

    // Attach user name to requests
    const requestsWithUserName = requestsResult.rows.map(r => ({
      ...r,
      user_name: user.name,
    }));

    res.json({
      profile: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      stats: statsResult.rows[0],
      requests: requestsWithUserName,
      weeklyRequests: weeklyRequestsResult.rows,
      bookingStatus: bookingStatusResult.rows,
      totalBookings: parseInt(totalBookingsResult.rows[0].total_bookings, 10), // ✅ added
      messages: parseInt(messagesResult.rows[0].total_messages, 10),
      pagination: {
        page,
        limit,
        total: parseInt(statsResult.rows[0].total),
      },
    });
  } catch (error) {
    console.error("User dashboard error:", error);
    res.status(500).json({ error: "Server error fetching user dashboard" });
  }
};

// 🆕 Create new service request
const createRequest = async (req, res) => {
  // Keep your existing request creation logic
};

// 🔄 Update request status
const updateRequestStatus = async (req, res) => {
  // Keep your existing request update logic
};

module.exports = {
  getDashboard,
  getProfessionalDashboard,
  getUserDashboard,
  createRequest,
  updateRequestStatus,
};
