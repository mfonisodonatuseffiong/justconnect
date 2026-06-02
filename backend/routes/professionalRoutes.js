// routes/professionalRoutes.js
const express = require("express");
const router = express.Router();
const professionalController = require("../controllers/professionalController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { pool } = require("../config/db"); // ✅ correct destructure

// ======================================================
// PROFESSIONAL ROUTES
// ======================================================

// ✅ Anyone can sign up
router.post("/", professionalController.createProfessional);

// ✅ Public browsing (search + filter supported)
router.get("/", professionalController.getAllProfessionals);

// ✅ API for professional dashboard details (placed before :id route to avoid conflicts)
router.get("/dashboard/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Profile basics
    const prof = await pool.query(
      `SELECT id, bio, rating, experience_years, service_area, is_available
       FROM professionals
       WHERE id = $1`,
      [id]
    );

    if (prof.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Professional not found" });
    }

    // Aggregates from bookings
    const pendingJobs = await pool.query(
      `SELECT COUNT(*) AS pending_jobs
       FROM bookings
       WHERE professional_id = $1
         AND status IN ('incoming','accepted','on_going')`,
      [id]
    );

    const completedJobs = await pool.query(
      `SELECT COUNT(*) AS completed_jobs
       FROM bookings
       WHERE professional_id = $1
         AND status = 'completed'`,
      [id]
    );

    const totalBookings = await pool.query(
      `SELECT COUNT(*) AS bookings
       FROM bookings
       WHERE professional_id = $1`,
      [id]
    );

    // Recent bookings
    const recentBookings = await pool.query(
      `SELECT service_id, address, status, booking_date
       FROM bookings
       WHERE professional_id = $1
       ORDER BY booking_date DESC
       LIMIT 3`,
      [id]
    );

    // Recent reviews
    const recentReviews = await pool.query(
      `SELECT r.review, r.rating, r.created_at, b.address
       FROM reviews r
       JOIN bookings b ON r.booking_id = b.id
       WHERE b.professional_id = $1
       ORDER BY r.created_at DESC
       LIMIT 2`,
      [id]
    );

    return res.json({
      success: true,
      ...prof.rows[0],
      pending_jobs: parseInt(pendingJobs.rows[0].pending_jobs, 10),
      completed_jobs: parseInt(completedJobs.rows[0].completed_jobs, 10),
      bookings: parseInt(totalBookings.rows[0].bookings, 10),
      recent_bookings: recentBookings.rows,
      recent_reviews: recentReviews.rows,
    });
  } catch (err) {
    console.error("Error fetching professional dashboard:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Protected routes
router.get("/:id", authenticateToken, professionalController.getProfessionalById);
router.put("/:id", authenticateToken, professionalController.updateProfessional);
router.delete("/:id", authenticateToken, professionalController.deleteProfessional);

module.exports = router;
