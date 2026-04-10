const { pool } = require("../config/db");

const Professional = {
  /**
   * Get all professionals with filters and pagination
   */
  getAll: async ({ category, search, page = 1, limit = 9 } = {}) => {
    try {
      let query = `
        SELECT *
        FROM professionals
        WHERE 1=1
      `;
      const values = [];
      let paramIndex = 1;

      // Filter by category (skill/service type)
      if (category) {
        query += ` AND category ILIKE $${paramIndex}`;
        values.push(`%${category}%`);
        paramIndex++;
      }

      // Search by name, category, or location
      if (search) {
        query += ` AND (
          name ILIKE $${paramIndex}
          OR category ILIKE $${paramIndex}
          OR location ILIKE $${paramIndex}
        )`;
        values.push(`%${search}%`);
        paramIndex++;
      }

      // Pagination
      const offset = (page - 1) * limit;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      values.push(limit, offset);

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("❌ Error in Professional.getAll:", error.message);
      throw error;
    }
  },

  /**
   * Get professional by ID
   */
  getById: async (id) => {
    try {
      const { rows } = await pool.query(
        `SELECT *
         FROM professionals
         WHERE id = $1`,
        [id],
      );
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error in Professional.getById:", error.message);
      throw error;
    }
  },

  /**
   * Create professional (signup)
   */
  create: async (data) => {
    const {
      name,
      email,
      password,
      role = "professional",
      category,
      location,
    } = data;

    try {
      const { rows } = await pool.query(
        `INSERT INTO professionals 
         (name, email, password, role, category, location, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         RETURNING *`,
        [name, email, password, role, category, location],
      );
      return rows[0];
    } catch (error) {
      console.error("❌ Error in Professional.create:", error.message);
      throw error;
    }
  },

  /**
   * Update professional (dashboard)
   */
  update: async (id, data) => {
    const { profile_picture, phone, address, sex, about, category, location } =
      data;

    try {
      const { rows } = await pool.query(
        `UPDATE professionals
         SET profile_picture = COALESCE($1, profile_picture),
             phone           = COALESCE($2, phone),
             address         = COALESCE($3, address),
             sex             = COALESCE($4, sex),
             about           = COALESCE($5, about),
             category        = COALESCE($6, category),
             location        = COALESCE($7, location),
             updated_at      = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [profile_picture, phone, address, sex, about, category, location, id],
      );
      return rows[0];
    } catch (error) {
      console.error("❌ Error in Professional.update:", error.message);
      throw error;
    }
  },

  /**
   * Delete professional
   */
  delete: async (id) => {
    try {
      const { rows } = await pool.query(
        "DELETE FROM professionals WHERE id = $1 RETURNING *",
        [id],
      );
      return rows[0];
    } catch (error) {
      console.error("❌ Error in Professional.delete:", error.message);
      throw error;
    }
  },

  /**
   * Search professionals (by name, category, or location)
   */
  search: async (term) => {
    try {
      const { rows } = await pool.query(
        `SELECT *
         FROM professionals
         WHERE name ILIKE $1
            OR category ILIKE $1
            OR location ILIKE $1
         ORDER BY id ASC`,
        [`%${term}%`],
      );
      return rows;
    } catch (error) {
      console.error("❌ Error in Professional.search:", error.message);
      throw error;
    }
  },
};

module.exports = { Professional };
