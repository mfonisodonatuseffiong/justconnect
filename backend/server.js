/**
 * JustConnect Backend Server
 * Main entry point - Express + Socket.IO + CORS + routes
 */

const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db"); // import db connection
const { Server } = require("socket.io");

// Load environment variables
dotenv.config();

// Initialize Express + HTTP Server
const app = express();
const server = http.createServer(app);

// =========================
// SOCKET.IO SETUP
// =========================
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (process.env.NODE_ENV !== "production") {
        // Allow all common dev ports
        const devOrigins = [
          "http://localhost:5173",
          "http://localhost:5174",
          "http://127.0.0.1:5173",
          "http://127.0.0.1:5174",
          "http://localhost:3000",
          "http://127.0.0.1:3000",
        ];
        if (!origin || devOrigins.includes(origin.replace(/\/$/, ""))) {
          return callback(null, true);
        }
      }

      // Production: only allow FRONTEND_URL
      const allowedOrigins = process.env.FRONTEND_URL
        ? [process.env.FRONTEND_URL.replace(/\/$/, "")]
        : [];
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }

      console.warn(`⚠️ Blocked CORS origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store active users
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on("authenticate", (userId) => {
    if (userId) {
      activeUsers.set(socket.id, userId);
      socket.join(`user_${userId}`);
      console.log(`👤 User ${userId} authenticated on socket ${socket.id}`);
    }
  });

  socket.on("disconnect", () => {
    const userId = activeUsers.get(socket.id);
    if (userId) {
      activeUsers.delete(socket.id);
      console.log(`👋 User ${userId} disconnected`);
    }
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

app.set("io", io);
app.set("activeUsers", activeUsers);

/* =========================
   CORE MIDDLEWARES
========================= */
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

/* =========================
   BASE & HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to JustConnect API 🚀",
    version: "v1",
    environment: process.env.NODE_ENV || "development",
    realtime: "Socket.IO enabled",
  });
});

// Health check endpoint (useful for monitoring)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   API ROUTES
========================= */
// Serve static uploads
app.use("/api/v1/uploads", express.static("uploads"));

app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/bookings", require("./routes/bookingRoutes"));
app.use("/api/v1/professionals", require("./routes/professionalRoutes"));
app.use("/api/v1/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/v1/services", require("./routes/serviceRoutes"));
app.use("/api/v1/requests", require("./routes/requestRoutes"));
app.use("/api/v1/upload", require("./routes/uploadRoutes"));
app.use("/api/v1/notifications", require("./routes/notificationRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/messages", require("./routes/messageRoutes"));
app.use("/api/v1/reviews", require("./routes/reviews"));
app.use("/api/v1/categories", require("./routes/categories"));

// Admin routes – THIS WAS MISSING!
app.use("/api/v1/admin", require("./routes/admin"));

/* =========================
   404 & GLOBAL ERROR HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error("💥 Global error:", err.stack || err.message);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? "Internal Server Error" : err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to db first
    console.log("⏳ Connecting to database...");
    await connectDB();
    console.log("✅ Database connected, starting server...");

    // start server
    server.listen(PORT, () => {
      console.log(`🚀 Justconnect Api server is running live on ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting up server", error.message);
    process.exit(1);
  }
};

startServer();
