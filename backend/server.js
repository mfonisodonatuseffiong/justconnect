// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const pool = require("./config/db"); // DB connection already tested

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ✅ Core middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ CORS configuration (dev vs prod)
const devOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const prodOrigins = [process.env.FRONTEND_URL]; // your production frontend URL
const allowedOrigins =
  process.env.NODE_ENV === "production" ? prodOrigins : devOrigins;

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (curl, Postman)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, ""); // remove trailing slash

    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.error("❌ Blocked CORS request from:", origin);
      callback(new Error(`CORS policy blocked request from origin: ${origin}`));
    }
  },
  credentials: true, // required for cookies
};
app.use(cors(corsOptions));

// ✅ Import route modules
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const professionalRoutes = require("./routes/professionalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const requestRoutes = require("./routes/requestRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

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
app.use("/api/v1/dashboard", dashboardRoutes); // includes professional dashboard route
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/requests", requestRoutes);
app.use("/api/v1/upload", uploadRoutes); // profile picture upload

// ✅ Handle unknown routes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// ✅ Central error handler
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
