const express = require("express");
const router = express.Router();
const { Service, ensureServiceTable } = require("../models/ServiceModel");


// Ensure the table exists when the server starts
ensureServiceTable();

/**
 * ============================================
 * SERVICES ROUTES
 * Handles fetching, adding, updating & deleting services
 * ============================================
 */

// 🟢 GET all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.getAll();
    res.status(200).json({
      success: true,
      message: "All service categories fetched successfully",
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("❌ Error fetching services:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching services",
    });
  }
});

// 🟣 GET single service by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.getById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service fetched successfully",
      service,
    });
  } catch (error) {
    console.error("❌ Error fetching service by ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching service",
    });
  }
});

// 🟠 POST — Add a new service
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Service name is required",
      });
    }

    const newService = await Service.create(name.trim());

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      service: newService,
    });
  } catch (error) {
    if (error.message.includes("duplicate key")) {
      return res.status(400).json({
        success: false,
        message: "Service already exists",
      });
    }

    console.error("❌ Error adding service:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error adding service",
    });
  }
});

// 🔵 PUT — Update an existing service
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Service name is required for update",
      });
    }

    const updated = await Service.update(id, name.trim());

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service: updated,
    });
  } catch (error) {
    console.error("❌ Error updating service:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error updating service",
    });
  }
});

// 🔴 DELETE — Remove a service
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Service.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting service:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error deleting service",
    });
  }
});

module.exports = router;
