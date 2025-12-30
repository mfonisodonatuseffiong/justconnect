const { Professional } = require("../models/professionalModel");

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

      // ✅ ARRAY ONLY (frontend compatible)
      return res.status(200).json(professionals);
    } catch (error) {
      console.error("❌ Error fetching professionals:", error.message);
      return res.status(500).json([]);
    }
  },

  getProfessionalById: async (req, res) => {
    try {
      const professional = await Professional.getById(req.params.id);
      if (!professional) {
        return res.status(404).json({ message: "Professional not found" });
      }
      return res.status(200).json(professional);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  },

  createProfessional: async (req, res) => {
    try {
      const professional = await Professional.create(req.body);
      return res.status(201).json(professional);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  },

  updateProfessional: async (req, res) => {
    try {
      const updated = await Professional.update(req.params.id, req.body);
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  },

  deleteProfessional: async (req, res) => {
    try {
      const deleted = await Professional.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Not found" });
      }
      return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = professionalController;
