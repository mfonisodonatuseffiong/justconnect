const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const pool = require("./db");

const authRoutes = require("./tconnect/routes/authRoutes");
const dashboardRoutes = require("./tconnect/routes/dashboardRoutes");
const bookingRoutes = require("./tconnect/routes/bookingRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const createBookingsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        jobDetails TEXT,
        professional TEXT,
        professionalContact TEXT,
        address TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        date DATE,
        time TIME
      );
    `);
    console.log("Bookings table is ready.");
  } catch (err) {
    console.error("Error creating bookings table:", err);
  }
};

createBookingsTable();

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
