const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { authenticateToken } = require("../middlewares/authMiddleware");

/**
 * ==========================================================
 * PROFESSIONAL CONTROLLER
 * Handles CRUD operations for professionals
 * ==========================================================
 */
const professionalController = {
  // ✅ Get all professionals
  getAllProfessionals: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM professionals ORDER BY id ASC");
      res.status(200).json({ professionals: result.rows });
    } catch (error) {
      console.error("❌ Error fetching professionals:", error);
      res.status(500).json({ error: "Server error while fetching professionals" });
    }
  },

  // ✅ Get single professional by ID
  getProfessionalById: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query("SELECT * FROM professionals WHERE id = $1", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Professional not found" });
      }
      res.status(200).json({ professional: result.rows[0] });
    } catch (error) {
      console.error("❌ Error fetching professional:", error);
      res.status(500).json({ error: "Server error while fetching professional" });
    }
  },

  // ✅ Create new professional profile (for admin or auto after signup)
  createProfessional: async (req, res) => {
    const { name, email, contact, category, experience, location, bio } = req.body;
    try {
      const existing = await pool.query("SELECT * FROM professionals WHERE email = $1", [email]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ message: "Professional with this email already exists" });
      }

      const result = await pool.query(
        `INSERT INTO professionals (name, email, contact, category, experience, location, bio)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [name, email, contact, category, experience, location, bio]
      );

      res.status(201).json({
        message: "Professional profile created successfully",
        professional: result.rows[0],
      });
    } catch (error) {
      console.error("❌ Error creating professional:", error);
      res.status(500).json({ error: "Server error while creating professional" });
    }
  },

  // ✅ Update professional (only self or admin)
  updateProfessional: async (req, res) => {
    const { id } = req.params;
    const { role, email: userEmail } = req.user;
    const { contact, category, experience, location, bio } = req.body;

    try {
      const existing = await pool.query("SELECT * FROM professionals WHERE id = $1", [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ message: "Professional not found" });
      }

      const professional = existing.rows[0];

      // Allow only the professional themself or an admin
      if (role !== "admin" && professional.email !== userEmail) {
        return res.status(403).json({ message: "Access denied: not authorized to update" });
      }

      const updated = await pool.query(
        `UPDATE professionals
         SET contact = COALESCE($1, contact),
             category = COALESCE($2, category),
             experience = COALESCE($3, experience),
             location = COALESCE($4, location),
             bio = COALESCE($5, bio)
         WHERE id = $6
         RETURNING *`,
        [contact, category, experience, location, bio, id]
      );

      res.status(200).json({
        message: "Professional updated successfully",
        professional: updated.rows[0],
      });
    } catch (error) {
      console.error("❌ Error updating professional:", error);
      res.status(500).json({ error: "Server error while updating professional" });
    }
  },

  // ✅ Delete professional (admin only)
  deleteProfessional: async (req, res) => {
    const { id } = req.params;
    const { role } = req.user;

    try {
      if (role !== "admin") {
        return res.status(403).json({ message: "Access denied: admin only" });
      }

      const result = await pool.query("DELETE FROM professionals WHERE id = $1 RETURNING *", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Professional not found" });
      }

      res.status(200).json({ message: "Professional deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting professional:", error);
      res.status(500).json({ error: "Server error while deleting professional" });
    }
  },
};

/**
 * ==========================================================
 * ROUTES
 * ==========================================================
 */
router.get("/", authenticateToken, professionalController.getAllProfessionals);
router.get("/:id", authenticateToken, professionalController.getProfessionalById);
router.post("/", authenticateToken, professionalController.createProfessional);
router.put("/:id", authenticateToken, professionalController.updateProfessional);
router.delete("/:id", authenticateToken, professionalController.deleteProfessional);

module.exports = router;
