const pool = require("../config/db");

const defaultServices = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Mechanic",
  "Cleaner",
  "Hair Stylist",
  "Tailor",
  "Driver",
  "Chef",
  "Technician",
  "Mason",
  "Gardener",
  "Teacher",
];

/**
 * Ensure the services table exists and seed default services
 */
const ensureServiceTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      );
    `);
    console.log("📦 Services table ready.");

    const { rows } = await pool.query("SELECT COUNT(*) FROM services");
    const count = parseInt(rows[0].count, 10);

    if (count === 0) {
      for (const name of defaultServices) {
        await pool.query("INSERT INTO services (name) VALUES ($1)", [name]);
      }
      console.log("🌱 Default services seeded successfully.");
    } else {
      console.log("✅ Services table already populated.");
    }
  } catch (err) {
    console.error("❌ Error ensuring services table:", err.message);
  }
};

/**
 * Service Model
 */
const Service = {
  // Get all services with optional pagination
  getAll: async (limit = 20, offset = 0) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM services ORDER BY id ASC LIMIT $1 OFFSET $2",
        [limit, offset]
      );
      return rows;
    } catch (err) {
      console.error("❌ Error fetching services:", err.message);
      throw err;
    }
  },

  // Count total services
  countAll: async () => {
    try {
      const { rows } = await pool.query("SELECT COUNT(*) FROM services");
      return parseInt(rows[0].count, 10);
    } catch (err) {
      console.error("❌ Error counting services:", err.message);
      throw err;
    }
  },

  // Get a service by ID
  getById: async (id) => {
    try {
      const { rows } = await pool.query("SELECT * FROM services WHERE id = $1", [id]);
      return rows[0];
    } catch (err) {
      console.error("❌ Error fetching service by ID:", err.message);
      throw err;
    }
  },

  // Create a new service
  create: async (name) => {
    try {
      const { rows } = await pool.query(
        "INSERT INTO services (name) VALUES ($1) RETURNING *",
        [name]
      );
      return rows[0];
    } catch (err) {
      console.error("❌ Error creating service:", err.message);
      throw err;
    }
  },

  // Update existing service
  update: async (id, name) => {
    try {
      const { rows } = await pool.query(
        "UPDATE services SET name = $1 WHERE id = $2 RETURNING *",
        [name, id]
      );
      return rows[0];
    } catch (err) {
      console.error("❌ Error updating service:", err.message);
      throw err;
    }
  },

  // Delete a service
  delete: async (id) => {
    try {
      const { rowCount } = await pool.query("DELETE FROM services WHERE id = $1", [id]);
      return rowCount > 0;
    } catch (err) {
      console.error("❌ Error deleting service:", err.message);
      throw err;
    }
  },
};

module.exports = { Service, ensureServiceTable };
