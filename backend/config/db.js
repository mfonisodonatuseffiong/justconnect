/**
 * @description This is our database config file,
 *              Made it exportable, to be start up in server.js
 */

const { Pool } = require("pg");
require("dotenv").config();

// ✅ Create connection pool
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
  ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
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
