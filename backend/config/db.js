const { Pool } = require("pg");
require("dotenv").config();

// ✅ Create connection pool
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
  ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false, // optional for hosted DBs
});

// ✅ Test connection once on startup
(async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to PostgreSQL database successfully");
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
    process.exit(1); // exit if DB connection fails
  }
})();

module.exports = pool;
