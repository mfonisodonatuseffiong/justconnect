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
      return res.status(403).json({ success: false, message: "Access denied. Users only." });
    }

    const userId = parseInt(req.params.userId, 10);
    if (!userId) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
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

    // Booking stats (for KPI card)
    const bookingStatsResult = await pool.query(
      `SELECT 
         COUNT(*) AS total_bookings,
         COUNT(*) FILTER (WHERE status ILIKE 'pending' OR status ILIKE 'in_progress') AS pending_bookings,
         COUNT(*) FILTER (WHERE status ILIKE 'completed' OR status ILIKE 'accepted') AS completed_bookings
       FROM bookings
       WHERE user_id = $1`,
      [userId]
    );

    // Booking status breakdown (for chart)
    const bookingStatusResult = await pool.query(
      `SELECT 
         CASE 
           WHEN status ILIKE 'accepted' THEN 'completed'
           WHEN status ILIKE 'in_progress' THEN 'pending'
           WHEN status ILIKE 'cancelled' THEN 'cancelled'
           ELSE status
         END AS status,
         COUNT(*) AS count
       FROM bookings
       WHERE user_id = $1
       GROUP BY status`,
      [userId]
    );

    // Recent bookings (limit 5)
    const recentBookingsResult = await pool.query(
      `SELECT b.id, s.name AS service_name, p.name AS professional_name, p.location AS professional_location,
              b.status, b.date
       FROM bookings b
       LEFT JOIN services s ON b.service_id = s.id
       LEFT JOIN professionals p ON b.professional_id = p.id
       WHERE b.user_id = $1
       ORDER BY b.date DESC
       LIMIT 5`,
      [userId]
    );

    // Messages count
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

    // Format booking stats
    const bookingStats = bookingStatsResult.rows[0] || {};
    const stats = {
      totalBookings: parseInt(bookingStats.total_bookings, 10) || 0,
      pendingBookings: parseInt(bookingStats.pending_bookings, 10) || 0,
      completedBookings: parseInt(bookingStats.completed_bookings, 10) || 0,
    };

    res.json({
      success: true,
      data: {
        profile: {
          id: userId,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        stats,
        recentBookings: recentBookingsResult.rows,
        requests: requestsWithUserName,
        weeklyRequests: weeklyRequestsResult.rows,
        bookingStatus: bookingStatusResult.rows,
        messages: parseInt(messagesResult.rows[0].total_messages, 10),
        pagination: {
          page,
          limit,
          total: parseInt(statsResult.rows[0].total, 10),
        },
      },
    });
  } catch (error) {
    console.error("User dashboard error:", error);
    res.status(500).json({ success: false, message: "Server error fetching user dashboard" });
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
