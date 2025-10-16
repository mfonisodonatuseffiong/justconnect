const pool = require("../../db"); // PostgreSQL connection

// ✅ Create a new booking
const createBooking = async (req, res) => {
  try {
    const { user_id, professional_id, service_id, date, time } = req.body;

    if (!user_id || !professional_id || !service_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `
      INSERT INTO bookings (user_id, professional_id, service_id, date, time, status)
      VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *;
    `;
    const result = await pool.query(query, [user_id, professional_id, service_id, date, time]);

    res.status(201).json({
      message: "Booking created successfully",
      booking: result.rows[0]
    });
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    res.status(500).json({ message: "Server error while creating booking" });
  }
};

// ✅ Get bookings by user
const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC`;
    const result = await pool.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ message: "Server error fetching bookings" });
  }
};

module.exports = {
  createBooking,
  getBookingsByUser,
};
