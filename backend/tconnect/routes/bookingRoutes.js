const express = require("express");
const router = express.Router();
const pool = require("../../db");
const { protect } = require("../../middleware/authMiddleware"); // <- destructure protect here

// POST /api/bookings - Guest or User books a professional
router.post("/", async (req, res) => {
  const {
    user,
    contact,
    address,
    jobDetails,
    professionalId,
    professional,
    professionalContact,
    date,
    time,
  } = req.body;

  try {
    const insertQuery = `
      INSERT INTO bookings 
        (user, contact, address, jobDetails, professionalId, professional, professionalContact, date, time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [
      user,
      contact,
      address,
      jobDetails,
      professionalId,
      professional,
      professionalContact,
      date,
      time,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// GET /api/bookings/user - Get bookings for the logged-in user
router.get("/user", protect, async (req, res) => {
  try {
    const userId = req.user.id; // From JWT
    const result = await pool.query(
      "SELECT * FROM bookings WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Failed to fetch user bookings" });
  }
});

// GET /api/bookings/professional - Get bookings for the logged-in professional
router.get("/professional", protect, async (req, res) => {
  try {
    if (req.user.role !== "professional") {
      return res.status(403).json({ error: "Access denied" });
    }

    const professionalName = req.user.name; // From JWT
    const result = await pool.query(
      "SELECT * FROM bookings WHERE professional = $1 ORDER BY date DESC, time DESC",
      [professionalName]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching professional bookings:", error);
    res.status(500).json({ error: "Failed to fetch professional bookings" });
  }
});

// PUT /api/bookings/:id/status - Update booking status (Accepted / Declined)
router.put("/:id/status", protect, async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  try {
    await pool.query(
      "UPDATE bookings SET status = $1 WHERE id = $2",
      [status, bookingId]
    );
    res.json({ message: "Booking status updated" });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
});

module.exports = router;
