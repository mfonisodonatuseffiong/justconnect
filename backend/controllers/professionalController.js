// controllers/professionalController.js
const { Professional } = require("../models/professionalModel");
const { pool } = require("../config/db");

const professionalController = {
  /* =====================================================
   * GET ALL PROFESSIONALS
   * ===================================================== */
  getAllProfessionals: async (req, res) => {
    try {
      const {
        search,
        service,
        sort,
        page = 1,
        limit = 9,
      } = req.query;

      const professionals = await Professional.getAll({
        search,
        service,
        sort,
        page: Number(page),
        limit: Number(limit),
      });

      return res.status(200).json({ success: true, data: professionals });
    } catch (error) {
      console.error("❌ Error fetching professionals:", error.message);
      return res.status(500).json({ success: false, data: [] });
    }
  },

  /* =====================================================
   * GET PROFESSIONAL BY ID
   * ===================================================== */
  getProfessionalById: async (req, res) => {
    try {
      const professional = await Professional.getById(req.params.id);
      if (!professional) {
        return res.status(404).json({ success: false, message: "Professional not found" });
      }
      return res.status(200).json({ success: true, data: professional });
    } catch (error) {
      console.error("❌ Error fetching professional:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  /* =====================================================
   * CREATE PROFESSIONAL
   * ===================================================== */
  createProfessional: async (req, res) => {
    try {
      const professional = await Professional.create(req.body);
      return res.status(201).json({ success: true, data: professional });
    } catch (error) {
      console.error("❌ Error creating professional:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  /* =====================================================
   * UPDATE PROFESSIONAL
   * ===================================================== */
  updateProfessional: async (req, res) => {
    try {
      const updated = await Professional.update(req.params.id, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error("❌ Error updating professional:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  /* =====================================================
   * DELETE PROFESSIONAL
   * ===================================================== */
  deleteProfessional: async (req, res) => {
    try {
      const deleted = await Professional.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Not found" });
      }
      return res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting professional:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  /* =====================================================
   * DASHBOARD DETAILS
   * ===================================================== */
  getDashboardDetails: async (req, res) => {
    try {
      const { id } = req.params;

      // Profile basics from professionals table
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

      // Recent bookings (only valid columns)
      const recentBookings = await pool.query(
        `SELECT service_id, status, booking_date
         FROM bookings
         WHERE professional_id = $1
         ORDER BY booking_date DESC
         LIMIT 3`,
        [id]
      );

      // Recent reviews (only valid columns)
      const recentReviews = await pool.query(
        `SELECT r.review, r.rating, r.created_at
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
      console.error("❌ Error fetching professional dashboard:", err.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },
};

module.exports = professionalController;
