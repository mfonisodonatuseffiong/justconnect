/**
 * @description A dummy / unused cors configuration from the server, copied here
 */

/* =========================
   CORS CONFIGURATION
========================= */
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const normalized = origin.replace(/\/$/, "");

    if (process.env.NODE_ENV !== "production") {
      const devOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ];
      if (devOrigins.includes(normalized)) {
        return callback(null, true);
      }
    } else {
      const allowed = process.env.FRONTEND_URL
        ? [process.env.FRONTEND_URL.replace(/\/$/, "")]
        : [];
      if (allowed.includes(normalized)) {
        return callback(null, true);
      }
    }

    console.warn(`CORS blocked: ${origin}`);
    callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
