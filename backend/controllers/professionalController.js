const { Professional } = require("../models/professionalModel");
const { authenticateToken } = require("../middlewares/authMiddleware");

const professionalController = {

  /** --------------------------------------------------------
   * GET ALL PROFESSIONALS
   * -------------------------------------------------------- */
  getAllProfessionals: async (req, res) => {
    try {
      const professionals = await Professional.getAll();
      res.status(200).json({
        success: true,
        total: professionals.length,
        professionals,
      });
    } catch (error) {
      console.error("❌ Error fetching professionals:", error.message);
      res.status(500).json({
        success: false,
        message: "Server error while fetching professionals",
      });
    }
  },

  /** --------------------------------------------------------
   * GET ONE PROFESSIONAL BY ID
   * -------------------------------------------------------- */
  getProfessionalById: async (req, res) => {
    try {
      const professional = await Professional.getById(req.params.id);

      if (!professional) {
        return res.status(404).json({
          success: false,
          message: "Professional not found",
        });
      }

      res.status(200).json({
        success: true,
        professional,
      });

    } catch (error) {
      console.error("❌ Error fetching professional:", error.message);
      res.status(500).json({
        success: false,
        message: "Server error while fetching professional",
      });
    }
  },

  /** --------------------------------------------------------
   * CREATE PROFESSIONAL (admin or signup auto-create)
   * -------------------------------------------------------- */
  createProfessional: async (req, res) => {
    try {
      const {
        name,
        email,
        profile_pic,
        contact,
        category,
        experience,
        location,
        bio,
        sex,
      } = req.body;

      // check if email already exists
      const existing = await Professional.getByEmail(email);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Professional with this email already exists",
        });
      }

      const professional = await Professional.create({
        name,
        email,
        profile_pic,
        contact,
        category,
        experience,
        location,
        bio,
        sex
      });

      return res.status(201).json({
        success: true,
        message: "Professional profile created successfully",
        professional,
      });

    } catch (error) {
      console.error("❌ Error creating professional:", error.message);
      res.status(500).json({
        success: false,
        message: "Server error while creating professional",
      });
    }
  },

  /** --------------------------------------------------------
   * UPDATE PROFESSIONAL PROFILE
   * Admin or the professional themself
   * -------------------------------------------------------- */
  updateProfessional: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        contact,
        category,
        experience,
        location,
        bio,
        profile_pic,
        sex
      } = req.body;

      const { role, email: loggedEmail } = req.user;

      const professional = await Professional.getById(id);
      if (!professional) {
        return res.status(404).json({
          success: false,
          message: "Professional not found",
        });
      }

      // Auth check
      if (role !== "admin" && loggedEmail !== professional.email) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const updated = await Professional.update(id, {
        contact,
        category,
        experience,
        location,
        bio,
        profile_pic,
        sex
      });

      res.status(200).json({
        success: true,
        message: "Professional updated successfully",
        professional: updated,
      });

    } catch (error) {
      console.error("❌ Error updating professional:", error.message);
      res.status(500).json({
        success: false,
        message: "Server error while updating professional",
      });
    }
  },

  /** --------------------------------------------------------
   * DELETE PROFESSIONAL (admin only)
   * -------------------------------------------------------- */
  deleteProfessional: async (req, res) => {
    try {
      const { role } = req.user;
      const { id } = req.params;

      if (role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied: admin only",
        });
      }

      const deleted = await Professional.delete(id);
      if (!deleted) {
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
      console.error("❌ Error deleting professional:", error.message);
      res.status(500).json({
        success: false,
        message: "Server error while deleting professional",
      });
    }
  },

};

module.exports = professionalController;
