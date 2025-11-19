// models/professionalModel.js
const pool = require("../config/db");

const Professional = {

  // ============================================
  // GET ALL PROFESSIONALS
  // ============================================
  getAll: async () => {
    const { rows } = await pool.query("SELECT * FROM professionals ORDER BY id ASC");
    return rows;
  },

  // ============================================
  // GET PROFESSIONAL BY ID
  // ============================================
  getById: async (id) => {
    const { rows } = await pool.query(
      "SELECT * FROM professionals WHERE id = $1",
      [id]
    );
    return rows[0];
  },

  // ============================================
  // CREATE PROFESSIONAL
  // ============================================
  create: async (data) => {
    const { 
      name, email, contact, category, experience, location, bio,
      profile_pic, sex 
    } = data;

    const { rows } = await pool.query(
      `INSERT INTO professionals 
       (name, email, contact, category, experience, location, bio, profile_pic, sex)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [name, email, contact, category, experience, location, bio, profile_pic, sex]
    );

    return rows[0];
  },

  // ============================================
  // UPDATE PROFESSIONAL
  // ============================================
  update: async (id, data) => {
    const { 
      contact, category, experience, location, bio,
      profile_pic, sex 
    } = data;

    const { rows } = await pool.query(
      `UPDATE professionals
       SET contact      = COALESCE($1, contact),
           category     = COALESCE($2, category),
           experience   = COALESCE($3, experience),
           location     = COALESCE($4, location),
           bio          = COALESCE($5, bio),
           profile_pic  = COALESCE($6, profile_pic),
           sex          = COALESCE($7, sex)
       WHERE id = $8
       RETURNING *`,
      [contact, category, experience, location, bio, profile_pic, sex, id]
    );

    return rows[0];
  },

  // ============================================
  // DELETE PROFESSIONAL
  // ============================================
  delete: async (id) => {
    const { rows } = await pool.query(
      "DELETE FROM professionals WHERE id = $1 RETURNING *",
      [id]
    );
    return rows[0];
  },
};

module.exports = { Professional };
