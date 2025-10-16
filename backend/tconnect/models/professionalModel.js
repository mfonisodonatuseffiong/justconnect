const pool = require("../../db");

// ✅ Ensure table exists on startup
const ensureProfessionalTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS professionals (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        contact VARCHAR(20),
        category VARCHAR(50),
        location VARCHAR(100),
        experience VARCHAR(50) DEFAULT '0',
        rating DECIMAL(3,2) DEFAULT 0.00,
        password VARCHAR(255) NOT NULL,
        profile_photo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("📦 Professionals table ready.");
  } catch (err) {
    console.error("❌ Error ensuring professionals table:", err.message);
  }
};

// ✅ CRUD model
const Professional = {
  // Get all professionals
  getAll: async () => {
    const { rows } = await pool.query("SELECT * FROM professionals ORDER BY id DESC");
    return rows;
  },

  // Get professional by ID
  getById: async (id) => {
    const { rows } = await pool.query("SELECT * FROM professionals WHERE id = $1", [id]);
    return rows[0];
  },

  // Create professional
  create: async (data) => {
    const {
      name,
      email,
      contact,
      category,
      location,
      password,
      profile_photo,
      experience = "0",
      rating = "0.00",
    } = data;

    const { rows } = await pool.query(
      `INSERT INTO professionals 
        (name, email, contact, category, location, password, profile_photo, experience, rating)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [name, email, contact, category, location, password, profile_photo, experience, rating]
    );

    return rows[0];
  },
};

// ✅ Get professionals with optional filters (category, location)
const getFiltered = async (filters = {}) => {
  let query = "SELECT * FROM professionals WHERE 1=1";
  const values = [];
  let index = 1;

  if (filters.category) {
    query += ` AND LOWER(category) = LOWER($${index++})`;
    values.push(filters.category);
  }

  if (filters.location) {
    query += ` AND LOWER(location) = LOWER($${index++})`;
    values.push(filters.location);
  }

  query += " ORDER BY id DESC";
  const { rows } = await pool.query(query, values);
  return rows;
};

// ✅ Export all
module.exports = {
  Professional,
  ensureProfessionalTable,
  getFiltered,
};
