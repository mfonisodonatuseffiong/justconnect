const pool = require("../config/db");

const Professional = {
  // Get all professionals
  getAll: async () => {
    const { rows } = await pool.query(
      `SELECT p.*, s.name AS service_name
       FROM professionals p
       LEFT JOIN services s ON p.service_id = s.id
       ORDER BY p.id ASC`
    );
    return rows;
  },

  // Get professional by ID
  getById: async (id) => {
    const { rows } = await pool.query(
      `SELECT p.*, s.name AS service_name
       FROM professionals p
       LEFT JOIN services s ON p.service_id = s.id
       WHERE p.id = $1`,
      [id]
    );
    return rows[0];
  },

  // Create professional
  create: async (data) => {
    const {
      name,
      email,
      contact,
      service_id,   // ✅ use service_id instead of category string
      experience,
      location,
      bio,
      photo,        // ✅ use photo instead of profile_pic
      sex,
    } = data;

    const { rows } = await pool.query(
      `INSERT INTO professionals 
       (name, email, contact, service_id, experience, location, bio, photo, sex)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [name, email, contact, service_id, experience, location, bio, photo, sex]
    );

    return rows[0];
  },

  // Update professional
  update: async (id, data) => {
    const {
      contact,
      service_id,
      experience,
      location,
      bio,
      photo,        // ✅ use photo instead of profile_pic
      sex,
    } = data;

    const { rows } = await pool.query(
      `UPDATE professionals
       SET contact    = COALESCE($1, contact),
           service_id = COALESCE($2, service_id),
           experience = COALESCE($3, experience),
           location   = COALESCE($4, location),
           bio        = COALESCE($5, bio),
           photo      = COALESCE($6, photo),
           sex        = COALESCE($7, sex)
       WHERE id = $8
       RETURNING *`,
      [contact, service_id, experience, location, bio, photo, sex, id]
    );

    return rows[0];
  },

  // Delete professional
  delete: async (id) => {
    const { rows } = await pool.query(
      "DELETE FROM professionals WHERE id = $1 RETURNING *",
      [id]
    );
    return rows[0];
  },

  // Search professionals (by name, service name, or location)
  search: async (term) => {
    const { rows } = await pool.query(
      `SELECT p.*, s.name AS service_name
       FROM professionals p
       LEFT JOIN services s ON p.service_id = s.id
       WHERE p.name ILIKE $1
          OR s.name ILIKE $1
          OR p.location ILIKE $1
       ORDER BY p.id ASC`,
      [`%${term}%`]
    );
    return rows;
  },
};

module.exports = { Professional };
