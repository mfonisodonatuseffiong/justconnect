const express = require("express");
const router = express.Router();
const professionalController = require("../controllers/professionalController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Anyone can sign up
router.post("/", professionalController.createProfessional);

// Protected routes
router.get("/", authenticateToken, professionalController.getAllProfessionals);
router.get("/:id", authenticateToken, professionalController.getProfessionalById);
router.put("/:id", authenticateToken, professionalController.updateProfessional);
router.delete("/:id", authenticateToken, professionalController.deleteProfessional);

module.exports = router;
