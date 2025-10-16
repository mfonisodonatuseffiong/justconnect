const { Service } = require("../models/serviceModel");

// 🟢 Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.getAll();
    res.status(200).json({
      success: true,
      message: "All services fetched successfully",
      count: services.length,
      services,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🟣 Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.getById(req.params.id);
    if (!service)
      return res.status(404).json({ success: false, message: "Service not found" });
    res.status(200).json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🟠 Create new service
exports.createService = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name required" });
    const newService = await Service.create(name);
    res.status(201).json({ success: true, message: "Service created", service: newService });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔵 Update service
exports.updateService = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    if (!name) return res.status(400).json({ success: false, message: "Name required" });

    const updated = await Service.update(id, name);
    if (!updated)
      return res.status(404).json({ success: false, message: "Service not found" });

    res.status(200).json({ success: true, message: "Service updated", service: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔴 Delete service
exports.deleteService = async (req, res) => {
  try {
    const deleted = await Service.delete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Service not found" });
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
