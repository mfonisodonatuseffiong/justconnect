const pool = require("../config/db");

/**
 * Service Model
 */
const Service = {
  // Get all services (for dropdowns or listings)
  getAll: async () => {
    try {
      const { rows } = await pool.query("SELECT * FROM services ORDER BY id ASC");
      return rows;
    } catch (err) {
      console.error("❌ Error fetching services:", err.message);
      throw err;
    }
  },

  // Get services by professional
  getByProfessional: async (professionalId) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM services WHERE professional_id = $1 ORDER BY id ASC",
        [professionalId]
      );
      return rows;
    } catch (err) {
      console.error("❌ Error fetching services by professional:", err.message);
      throw err;
    }
  },

  // Create a new service for a professional
  create: async (professionalId, service_name, description = null, price = null) => {
    try {
      const { rows } = await pool.query(
        `INSERT INTO services (professional_id, service_name, description, price, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING *`,
        [professionalId, service_name, description, price]
      );
      return rows[0];
    } catch (err) {
      console.error("❌ Error creating service:", err.message);
      throw err;
    }
  },

  // Update an existing service
  update: async (id, { service_name, description, price }) => {
    try {
      const { rows } = await pool.query(
        `UPDATE services
         SET service_name = COALESCE($1, service_name),
             description  = COALESCE($2, description),
             price        = COALESCE($3, price)
         WHERE id = $4
         RETURNING *`,
        [service_name, description, price, id]
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

module.exports = { Service };
