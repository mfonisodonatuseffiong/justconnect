const express = require("express");
const router = express.Router();
const pool = require("../../db");
const { protect } = require("../middlewares/authMiddleware");

// 📝 Create a new booking
router.post("/", async (req, res) => {
  const {
    user_id,
    user_name,
    contact,
    address,
    jobDetails,
    professional_id,
    professional,
    professionalContact,
    date,
    time,
  } = req.body;

  const roomId = `${professional_id}-${Date.now()}`;

  try {
    const insertQuery = `
      INSERT INTO bookings 
        (user_id, user_name, contact, address, job_details, professional_id, professional, professionalcontact, date, time, roomid)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const result = await pool.query(insertQuery, [
      user_id,
      user_name,
      contact,
      address,
      jobDetails,
      professional_id,
      professional,
      professionalContact,
      date,
      time,
      roomId,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error creating booking:", error.message);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// 🔍 Get bookings for logged-in user
router.get("/user", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching user bookings:", error.message);
    res.status(500).json({ error: "Failed to fetch user bookings" });
  }
});

// 🔍 Get bookings for logged-in professional
router.get("/professional", protect, async (req, res) => {
  try {
    if (req.user.role !== "professional") {
      return res.status(403).json({ error: "Access denied" });
    }

    const professionalName = req.user.name;
    const result = await pool.query(
      "SELECT * FROM bookings WHERE professional = $1 ORDER BY created_at DESC",
      [professionalName]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching professional bookings:", error.message);
    res.status(500).json({ error: "Failed to fetch professional bookings" });
  }
});

// 🔄 Update booking status + emit Socket.IO events if accepted
router.put("/:id/status", protect, async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  try {
    const updateResult = await pool.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      [status, bookingId]
    );

    const updatedBooking = updateResult.rows[0];

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (status.toLowerCase() === "accepted") {
      const io = req.app.get("io");
      const roomId = updatedBooking.roomid;

      if (roomId && io) {
        io.to(roomId).emit("chatAllowed", {
          roomId,
          user: updatedBooking.user_id,
          professional: updatedBooking.professional,
          bookingId: updatedBooking.id,
        });
        console.log(`📨 'chatAllowed' emitted to room: ${roomId}`);
      }
    }

    res.json({ message: "Booking status updated", booking: updatedBooking });
  } catch (error) {
    console.error("❌ Error updating booking status:", error.message);
    res.status(500).json({ error: "Failed to update booking status" });
  }
});

// ❌ Cancel booking route
router.post("/:id/cancel", protect, async (req, res) => {
  const bookingId = req.params.id;

  try {
    const result = await pool.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      ["cancelled", bookingId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking cancelled successfully", booking: result.rows[0] });
  } catch (error) {
    console.error("❌ Error cancelling booking:", error.message);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

module.exports = router;
