const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const { verifyToken } = require("../middleware/authMiddleware");

// Route to update booking status
router.put("/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    // Find and update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Emit events using Socket.IO
    const io = req.app.get("io");
    const roomId = updatedBooking.roomid;

    if (roomId && io) {
      if (status.toLowerCase() === "accepted") {
        io.to(roomId).emit("acceptedMessage", {
          message: `Your booking has been accepted by ${updatedBooking.professional}`,
        });

        io.to(roomId).emit("chatAllowed", {
          roomId,
          user: updatedBooking.user_id,
          professional: updatedBooking.professional,
          bookingId: updatedBooking.id,
        });

        console.log(`✅ acceptedMessage and chatAllowed emitted to room ${roomId}`);
      } else if (status.toLowerCase() === "declined") {
        io.to(roomId).emit("declineMessage", {
          message: `Sorry, your booking was declined by ${updatedBooking.professional}`,
        });

        console.log(`❌ declineMessage emitted to room ${roomId}`);
      } else if (status.toLowerCase() === "closed") {
        io.to(roomId).emit("bookingClosed", {
          message: `Your booking has been closed by ${updatedBooking.professional}`,
        });

        console.log(`🔒 bookingClosed emitted to room ${roomId}`);
      }
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
