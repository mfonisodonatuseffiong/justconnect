// controllers/bookingController.js
const pool = require("../config/db");

module.exports = {
  createNewBooking: async (req, res) => {
    res.json({ message: "Booking created!" });
  },
  getAll: async (req, res) => {
    res.json({ message: "All bookings" });
  },
  getUserBookings: async (req, res) => {
    res.json({ message: `User ${req.params.userId} bookings` });
  },
  getProfessionalBookings: async (req, res) => {
    res.json({ message: `Professional ${req.params.professionalId} bookings` });
  },
  updateStatus: async (req, res) => {
    res.json({ message: `Booking ${req.params.id} status updated` });
  },
  deleteBookingRecord: async (req, res) => {
    res.json({ message: `Booking ${req.params.id} deleted` });
  },
};
