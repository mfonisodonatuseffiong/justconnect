// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const pool = require("./config/db"); // ✅ Ensure database connects before serving routes

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// ✅ Core middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));

// ✅ Database Connection Check
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL database successfully"))
  .catch((err) => console.error("❌ Database connection error:", err.message));

// ✅ Import route modules
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const professionalRoutes = require("./routes/professionalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const requestRoutes = require("./routes/requestRoutes");

// ✅ Base test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to JustConnect API 🚀",
    version: "v1",
  });
});

// ✅ Mount API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/professionals", professionalRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/services", serviceRoutes); // <-- includes admin/overview and all service routes
app.use("/api/v1/requests", requestRoutes);

// ✅ Handle unknown routes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// ✅ Central error handler (for safety)
app.use((err, req, res, next) => {
  console.error("💥 Global error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
