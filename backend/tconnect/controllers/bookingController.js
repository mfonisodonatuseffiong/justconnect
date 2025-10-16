const {
  createBooking,
  getAllBookings,
  getBookingsByUser,
  getBookingsByProfessional,
  updateBookingStatus,
  deleteBooking,
} = require("../models/Booking");

/**
 * ==============================================
 * BOOKING CONTROLLER
 * Handles all logic for creating and managing bookings
 * ==============================================
 */

// 🟢 Create a new booking (User clicks “Hire Me”)
const createNewBooking = async (req, res) => {
  try {
    const { user_id, professional_id, service_id, date, time, notes } = req.body;

    if (!user_id || !professional_id || !service_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: user_id, professional_id, or service_id",
      });
    }

    const booking = await createBooking({
      user_id,
      professional_id,
      service_id,
      date,
      time,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ Error creating booking:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while creating booking",
    });
  }
};

// 🔵 Get all bookings (Admin or system use)
const getAll = async (req, res) => {
  try {
    const bookings = await getAllBookings();
    res.status(200).json({
      success: true,
      message: "All bookings fetched successfully",
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("❌ Error fetching all bookings:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching all bookings",
    });
  }
};

// 🟣 Get bookings for a specific user
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await getBookingsByUser(userId);

    res.status(200).json({
      success: true,
      message: "User bookings fetched successfully",
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("❌ Error fetching user bookings:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching user bookings",
    });
  }
};

// 🟠 Get bookings for a professional (Dashboard view)
const getProfessionalBookings = async (req, res) => {
  try {
    const { professionalId } = req.params;
    const bookings = await getBookingsByProfessional(professionalId);

    res.status(200).json({
      success: true,
      message: "Professional bookings fetched successfully",
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("❌ Error fetching professional bookings:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching professional bookings",
    });
  }
};

// 🟡 Update booking status (accept/reject/complete)
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Booking status is required",
      });
    }

    const updated = await updateBookingStatus(id, status);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking: updated,
    });
  } catch (error) {
    console.error("❌ Error updating booking:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error updating booking",
    });
  }
};

// 🔴 Delete a booking (optional)
const deleteBookingRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteBooking(id);

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting booking:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error deleting booking",
    });
  }
};

module.exports = {
  createNewBooking,
  getAll,
  getUserBookings,
  getProfessionalBookings,
  updateStatus,
  deleteBookingRecord,
};
