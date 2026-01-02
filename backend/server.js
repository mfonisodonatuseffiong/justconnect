// server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
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
        return callback(null, true);
      }

      const allowedOrigins = process.env.FRONTEND_URL
        ? [process.env.FRONTEND_URL.replace(/\/$/, "")]
        : [];
      
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }
      
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store active users
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

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
    console.log("🔌 Client disconnected:", socket.id);
  });
});

app.set("io", io);
app.set("activeUsers", activeUsers);

/* =========================
   CORE MIDDLEWARES
========================= */
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

/* =========================
   CORS CONFIGURATION
========================= */
const devOriginRegex = /^http:\/\/(localhost|127\.0\.0\.1):517\d$/;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, "");

    if (process.env.NODE_ENV !== "production") {
      if (devOriginRegex.test(normalizedOrigin)) {
        return callback(null, true);
      }
    } else {
      const allowed = process.env.FRONTEND_URL
        ? [process.env.FRONTEND_URL.replace(/\/$/, "")]
        : [];
      if (allowed.includes(normalizedOrigin)) {
        return callback(null, true);
      }
    }

    console.error("❌ Blocked CORS:", normalizedOrigin);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ ADD THIS LINE — Serve uploaded images
app.use("/uploads", express.static("uploads"));

/* =========================
   ROUTES
========================= */
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const professionalRoutes = require("./routes/professionalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const requestRoutes = require("./routes/requestRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

/* =========================
   BASE ROUTE
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

/* =========================
   API ROUTES
========================= */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/professionals", professionalRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/requests", requestRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/messages", messageRoutes);

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("💥 Global error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 JustConnect API running on port ${PORT}`);
  console.log(`🔌 Socket.IO ready for real-time updates`);
  if (process.env.NODE_ENV !== "production") {
    console.log(`🌐 Dev frontend: http://localhost:5173`);
  }
});