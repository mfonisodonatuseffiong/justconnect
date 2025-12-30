// models/messageModel.js
const pool = require("../config/db");

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
   * CREATE A NEW MESSAGE
   * -------------------------------------------------------- */
  create: async ({ sender_id, receiver_id, content }) => {
    const { rows } = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [sender_id, receiver_id, content]
    );
    return rows[0];
  },
};

module.exports = Message;
