const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const pool = require("./db");

// Route imports
const authRoutes = require("./tconnect/routes/authRoutes");
const professionalAuthRoutes = require("./tconnect/routes/professionalAuthRoutes");
const dashboardRoutes = require("./tconnect/routes/dashboardRoutes");
const bookingRoutes = require("./tconnect/routes/bookingRoutes");

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Optional: Log all incoming requests
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Setup or update bookings table
const ensureBookingsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        jobDetails TEXT,
        address TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        date DATE,
        time TIME
      );
    `);
    console.log("📦 Bookings table exists or created.");

    // Check for and add missing columns (safe migrations)
    const result = await pool.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'bookings';
    `);

    const columns = result.rows.map(row => row.column_name);
    const alterQueries = [];

    if (!columns.includes("professional")) {
      alterQueries.push(`ADD COLUMN professional TEXT`);
    }
    if (!columns.includes("professionalContact")) {
      alterQueries.push(`ADD COLUMN professionalContact TEXT`);
    }

    if (alterQueries.length > 0) {
      const alterSQL = `ALTER TABLE bookings ${alterQueries.join(", ")};`;
      await pool.query(alterSQL);
      console.log("🛠️  Bookings table updated with new columns.");
    } else {
      console.log("✅ Bookings table already up to date.");
    }

  } catch (err) {
    console.error("❌ Error setting up bookings table:", err.message);
  }
};

ensureBookingsTable();

// ✅ Mount API routes
app.use("/api/auth", authRoutes);                  // /login, /register
app.use("/api/auth", professionalAuthRoutes);      // /professional-login
app.use("/api/dashboard", dashboardRoutes);        // /dashboard
app.use("/api/bookings", bookingRoutes);           // /bookings

console.log("✅ Auth routes mounted:");
console.log("   - /api/auth/login");
console.log("   - /api/auth/register");
console.log("   - /api/auth/professional-login");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
