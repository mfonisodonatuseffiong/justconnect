const {pool} = require("../config/db");

const Message = {
  /** --------------------------------------------------------
   * GET ALL MESSAGES FOR A USER (sent or received)
   * -------------------------------------------------------- */
  getByUserId: async (userId) => {
    const { rows } = await pool.query(
      `SELECT * FROM messages 
       WHERE sender_id = $1 OR receiver_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },

  /** --------------------------------------------------------
   * GET ALL MESSAGES FOR A PROFESSIONAL (sent or received)
   * -------------------------------------------------------- */
  getByProfessionalId: async (professionalId) => {
    const { rows } = await pool.query(
      `SELECT * FROM messages 
       WHERE sender_id = $1 OR receiver_id = $1 
       ORDER BY created_at DESC`,
      [professionalId]
    );
    return rows;
  },

  /** --------------------------------------------------------
   * CREATE A NEW MESSAGE
   * -------------------------------------------------------- */
  create: async ({ sender_id, receiver_id, content, booking_id = null }) => {
    const { rows } = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content, booking_id, created_at, deleted) 
       VALUES ($1, $2, $3, $4, NOW(), false)
       RETURNING *`,
      [sender_id, receiver_id, content, booking_id]
    );
    return rows[0];
  },

  /** --------------------------------------------------------
   * SOFT DELETE A MESSAGE
   * -------------------------------------------------------- */
  softDelete: async (id) => {
    const { rows } = await pool.query(
      `UPDATE messages 
       SET deleted = true, deleted_at = NOW() 
       WHERE id = $1 
       RETURNING sender_id, receiver_id`,
      [id]
    );
    return rows[0]; // returns sender_id and receiver_id if found
  },
};

module.exports = Message;
