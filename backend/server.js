const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const pool = require("./db");

dotenv.config();

const app = express();
const server = http.createServer(app);

// 🔌 Setup Socket.IO
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// 🔁 Socket.IO real-time logic
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`✅ Socket joined room: ${roomId}`);
  });

  socket.on("sendMessage", ({ roomId, sender, message }) => {
    io.to(roomId).emit("receiveMessage", { sender, message });
  });

  socket.on("bookingDeclined", ({ roomId, message }) => {
    console.log(`❌ Booking declined in room ${roomId}`);
    io.to(roomId).emit("declineMessage", { message });
  });

  socket.on("bookingAccepted", ({ roomId, message }) => {
    console.log(`✅ Booking accepted in room ${roomId}`);
    io.to(roomId).emit("acceptedMessage", { message });
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

// make io available inside routes
app.set("io", io);

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5173", // frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 🔍 Request Logger
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// 🛠️ Ensure bookings table and columns
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

    const result = await pool.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'bookings';
    `);

    const columns = result.rows.map((row) => row.column_name);
    const alterQueries = [];

    if (!columns.includes("professional")) {
      alterQueries.push(`ADD COLUMN professional TEXT`);
    }
    if (!columns.includes("professionalcontact")) {
      alterQueries.push(`ADD COLUMN professionalContact TEXT`);
    }
    if (!columns.includes("roomid")) {
      alterQueries.push(`ADD COLUMN roomId TEXT`);
    }

    if (alterQueries.length > 0) {
      await pool.query(`ALTER TABLE bookings ${alterQueries.join(", ")};`);
      console.log("🛠️  Bookings table updated with new columns.");
    } else {
      console.log("✅ Bookings table already up to date.");
    }
  } catch (err) {
    console.error("❌ Error ensuring bookings table:", err.message);
  }
};

ensureBookingsTable();

// ✅ Routes
const authRoutes = require("./tconnect/routes/authRoutes");
const professionalAuthRoutes = require("./tconnect/routes/professionalAuthRoutes");
const dashboardRoutes = require("./tconnect/routes/dashboardRoutes");
const bookingRoutes = require("./tconnect/routes/bookingRoutes");

// mount routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth", professionalAuthRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/bookings", bookingRoutes);

console.log("✅ API routes mounted:");
console.log("   - /api/v1/auth/register");
console.log("   - /api/v1/auth/login");
console.log("   - /api/v1/auth/professional-login");
console.log("   - /api/v1/dashboard");
console.log("   - /api/v1/bookings");

// 🚀 Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running with Socket.IO on port ${PORT}`);
});
