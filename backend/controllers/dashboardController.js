const { pool } = require("../config/db");

/**
 * ==========================================================
 * DASHBOARD CONTROLLERS
 * ==========================================================
 */

// 🧭 Unified dashboard (auto-detect role: user/professional/admin)
const getDashboard = async (req, res) => {
  // We can implement role-based logic here:
  // - If admin: show global stats
  // - If professional: show professional dashboard
  // - If user: show user dashboard
  res.json({ success: true, message: "Unified dashboard logic not yet implemented" });
};

// 🧰 Professional dashboard
const getProfessionalDashboard = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "professional") {
      return res.status(403).json({ success: false, message: "Access denied. Professionals only." });
    }

    const professionalResult = await pool.query(
      `SELECT p.id, u.name, u.email, p.bio, p.rating, p.experience_years, p.service_area, p.is_available
       FROM professionals p
       JOIN users u ON p.user_id = u.id
       WHERE u.id = $1`,
      [user.id]
    );

    const bookingsResult = await pool.query(
      `SELECT COUNT(*) AS total,
              COUNT(*) FILTER (WHERE status='incoming') AS incoming,
              COUNT(*) FILTER (WHERE status='accepted') AS accepted,
              COUNT(*) FILTER (WHERE status='on_going') AS on_going,
              COUNT(*) FILTER (WHERE status='completed') AS completed,
              COUNT(*) FILTER (WHERE status='cancelled') AS cancelled
       FROM bookings
       WHERE professional_id = $1`,
      [professionalResult.rows[0].id]
    );

    res.json({
      success: true,
      data: {
        profile: professionalResult.rows[0],
        stats: bookingsResult.rows[0],
      },
    });
  } catch (error) {
    console.error("Professional dashboard error:", error);
    res.status(500).json({ success: false, message: "Server error fetching professional dashboard" });
  }
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

    // Booking stats
    const bookingStatsResult = await pool.query(
      `SELECT 
         COUNT(*) AS total,
         COUNT(*) FILTER (WHERE status='incoming') AS incoming,
         COUNT(*) FILTER (WHERE status='accepted') AS accepted,
         COUNT(*) FILTER (WHERE status='on_going') AS on_going,
         COUNT(*) FILTER (WHERE status='completed') AS completed,
         COUNT(*) FILTER (WHERE status='cancelled') AS cancelled
       FROM bookings
       WHERE customer_id = $1`,
      [userId]
    );

    // Booking status breakdown
    const bookingStatusResult = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM bookings
       WHERE customer_id = $1
       GROUP BY status`,
      [userId]
    );

    // Recent bookings (limit 5)
    const recentBookingsResult = await pool.query(
      `SELECT b.id, b.booking_date, b.status, b.address, b.note,
              s.service_name, s.price,
              u.name AS professional_name, p.rating AS professional_rating
       FROM bookings b
       LEFT JOIN services s ON b.service_id = s.id
       LEFT JOIN professionals p ON b.professional_id = p.id
       LEFT JOIN users u ON p.user_id = u.id
       WHERE b.customer_id = $1
       ORDER BY b.booking_date DESC
       LIMIT 5`,
      [userId]
    );

    // Reviews (limit 5)
    const reviewsResult = await pool.query(
      `SELECT r.id, r.booking_id, r.rating, r.review, r.created_at,
              u.name AS professional_name
       FROM reviews r
       JOIN bookings b ON r.booking_id = b.id
       JOIN professionals p ON b.professional_id = p.id
       JOIN users u ON p.user_id = u.id
       WHERE b.customer_id = $1
       ORDER BY r.created_at DESC
       LIMIT 5`,
      [userId]
    );

    const stats = bookingStatsResult.rows[0] || {};

    res.json({
      success: true,
      data: {
        profile: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile_picture: user.profile_picture,
          phone: user.phone,
          location: user.location,
        },
        stats: {
          totalBookings: parseInt(stats.total, 10) || 0,
          incomingBookings: parseInt(stats.incoming, 10) || 0,
          acceptedBookings: parseInt(stats.accepted, 10) || 0,
          onGoingBookings: parseInt(stats.on_going, 10) || 0,
          completedBookings: parseInt(stats.completed, 10) || 0,
          cancelledBookings: parseInt(stats.cancelled, 10) || 0,
        },
        bookingStatus: bookingStatusResult.rows,
        recentBookings: recentBookingsResult.rows,
        reviews: reviewsResult.rows,
      },
    });
  } catch (error) {
    console.error("User dashboard error:", error);
    res.status(500).json({ success: false, message: "Server error fetching user dashboard" });
  }
};

// 🆕 Create new service request (if you want users to book services directly)
const createRequest = async (req, res) => {
  res.json({ success: true, message: "Service request creation logic not yet implemented" });
};

// 🔄 Update request status (for professionals/admins)
const updateRequestStatus = async (req, res) => {
  res.json({ success: true, message: "Request status update logic not yet implemented" });
};

module.exports = {
  getDashboard,
  getProfessionalDashboard,
  getUserDashboard,
  createRequest,
  updateRequestStatus,
};
