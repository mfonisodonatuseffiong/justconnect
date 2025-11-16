// models/serviceModel.js
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

// Ensure table exists and seed default data
const ensureServiceTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      );
    `);
    console.log("📦 Services table ready.");

    const result = await pool.query("SELECT COUNT(*) FROM services");
    const count = parseInt(result.rows[0].count, 10);

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

// CRUD operations
const Service = {
  getAll: async () => {
    const { rows } = await pool.query("SELECT * FROM services ORDER BY id ASC");
    return rows;
  },

  getById: async (id) => {
    const { rows } = await pool.query("SELECT * FROM services WHERE id = $1", [id]);
    return rows[0];
  },

  create: async (name) => {
    const { rows } = await pool.query(
      "INSERT INTO services (name) VALUES ($1) RETURNING *",
      [name]
    );
    return rows[0];
  },

  update: async (id, name) => {
    const { rows } = await pool.query(
      "UPDATE services SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    return rows[0];
  },

  delete: async (id) => {
    const { rowCount } = await pool.query("DELETE FROM services WHERE id = $1", [id]);
    return rowCount > 0;
  },
};

module.exports = { Service, ensureServiceTable };
