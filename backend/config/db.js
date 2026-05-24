/**
 * @description PostgreSQL database configuration.
 *              Exportable for use in server.js and controllers.
 */

const { Pool } = require("pg");
require("dotenv").config();

// ✅ Create connection pool
const pool = new Pool({
  user: process.env.PGUSER,        // matches .env (PGUSER=postgres)
  host: process.env.PGHOST,        // matches .env (PGHOST=localhost)
  database: process.env.PGDATABASE,// matches .env (PGDATABASE=justconnect)
  password: process.env.PGPASSWORD,// matches .env (PGPASSWORD=effiong)
  port: process.env.PGPORT || 5432,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false,
});

// Function to test connection
const connectDB = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ Connected to PostgreSQL database successfully");
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
