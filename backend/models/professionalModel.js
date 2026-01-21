const pool = require("../config/db");

const Professional = {
  /**
   * Get all professionals with filters and pagination
   * @param {Object} options
   * @param {string} [options.service] - service name (e.g. "Carpentry", "Plumbing")
   * @param {string} [options.search] - search term (name, service, location)
   * @param {number} [options.page=1] - page number
   * @param {number} [options.limit=9] - items per page
   * @returns {Promise<Array>} filtered professionals
   */
  getAll: async ({ service, search, page = 1, limit = 9 } = {}) => {
    try {
      let query = `
        SELECT p.*, s.name AS service_name
        FROM professionals p
        LEFT JOIN services s ON p.service_id = s.id
        WHERE 1=1
      `;
      const values = [];
      let paramIndex = 1;

      // Filter by service name (partial, case-insensitive)
      if (service) {
        query += ` AND s.name ILIKE $${paramIndex}`;
        values.push(`%${service}%`);
        paramIndex++;
      }

      // Search by name, service name, or location
      if (search) {
        query += ` AND (
          p.name ILIKE $${paramIndex}
          OR s.name ILIKE $${paramIndex}
          OR p.location ILIKE $${paramIndex}
        )`;
        values.push(`%${search}%`);
        paramIndex++;
      }

      // Get total count (for pagination)
      const countQuery = `SELECT COUNT(*) FROM (${query}) AS sub`;
      const countResult = await pool.query(countQuery, values);
      const total = parseInt(countResult.rows[0].count);

      // Pagination
      const offset = (page - 1) * limit;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      values.push(limit, offset);

      // Execute main query
      const result = await pool.query(query, values);

      // Return array only (your frontend expects this)
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
        `SELECT p.*, s.name AS service_name
         FROM professionals p
         LEFT JOIN services s ON p.service_id = s.id
         WHERE p.id = $1`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error in Professional.getById:", error.message);
      throw error;
    }
  },

  /**
   * Create professional
   */
  create: async (data) => {
    const {
      name,
      email,
      contact,
      service_id,
      experience,
      location,
      bio,
      photo,
      sex,
    } = data;

    try {
      const { rows } = await pool.query(
        `INSERT INTO professionals 
         (name, email, contact, service_id, experience, location, bio, photo, sex)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [name, email, contact, service_id, experience, location, bio, photo, sex]
      );
      return rows[0];
    } catch (error) {
      console.error("❌ Error in Professional.create:", error.message);
      throw error;
    }
  },

  /**
   * Update professional
   */
  update: async (id, data) => {
    const {
      contact,
      service_id,
      experience,
      location,
      bio,
      photo,
      sex,
    } = data;

    try {
      const { rows } = await pool.query(
        `UPDATE professionals
         SET contact    = COALESCE($1, contact),
             service_id = COALESCE($2, service_id),
             experience = COALESCE($3, experience),
             location   = COALESCE($4, location),
             bio        = COALESCE($5, bio),
             photo      = COALESCE($6, photo),
             sex        = COALESCE($7, sex),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [contact, service_id, experience, location, bio, photo, sex, id]
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
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error("❌ Error in Professional.delete:", error.message);
      throw error;
    }
  },

  /**
   * Search professionals (by name, service name, or location)
   * (optional - you can keep or remove)
   */
  search: async (term) => {
    try {
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
    } catch (error) {
      console.error("❌ Error in Professional.search:", error.message);
      throw error;
    }
  },
};

module.exports = { Professional };