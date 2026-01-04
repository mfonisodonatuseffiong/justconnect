// controllers/messageController.js
const pool = require("../config/db");

const messageController = {
  // Get messages for a specific user
  getUserMessages: async (req, res) => {
    try {
      const { userId } = req.params;

      const result = await pool.query(
        `SELECT m.*, 
                sender.name AS sender_name,
                receiver.name AS receiver_name
         FROM messages m
         LEFT JOIN users sender ON m.sender_id = sender.id
         LEFT JOIN users receiver ON m.receiver_id = receiver.id
         WHERE m.sender_id = $1 OR m.receiver_id = $1 
         ORDER BY m.created_at DESC`,
        [userId]
      );

      res.status(200).json({
        success: true,
        data: result.rows,
      });
    } catch (err) {
      console.error("❌ Error fetching messages:", err.message);
      res.status(500).json({ success: false, message: "Server error fetching messages" });
    }
  },

  // Send a new message + Real-time broadcast
  sendMessage: async (req, res) => {
    try {
      const { sender_id, receiver_id, content, booking_id } = req.body;

      if (!sender_id || !receiver_id || !content?.trim()) {
        return res.status(400).json({ 
          success: false, 
          message: "Sender, receiver, and message content are required" 
        });
      }

      // ✅ Check booking acceptance before allowing chat
      if (booking_id) {
        const bookingRes = await pool.query(
          `SELECT status FROM bookings 
           WHERE id = $1 AND (user_id = $2 OR professional_id = $2)`,
          [booking_id, sender_id]
        );

        if (bookingRes.rows.length === 0) {
          return res.status(404).json({ success: false, message: "Booking not found" });
        }

        if (bookingRes.rows[0].status !== "accepted") {
          return res.status(403).json({ 
            success: false, 
            message: "Chat is only available once the professional accepts the booking" 
          });
        }
      }

      // Insert message
      const result = await pool.query(
        `INSERT INTO messages (sender_id, receiver_id, content, booking_id, created_at) 
         VALUES ($1, $2, $3, $4, NOW()) 
         RETURNING *`,
        [sender_id, receiver_id, content.trim(), booking_id || null]
      );

      const newMessage = result.rows[0];

      // Enrich with names
      const enriched = await pool.query(
        `SELECT m.*, 
                sender.name AS sender_name,
                receiver.name AS receiver_name
         FROM messages m
         LEFT JOIN users sender ON m.sender_id = sender.id
         LEFT JOIN users receiver ON m.receiver_id = receiver.id
         WHERE m.id = $1`,
        [newMessage.id]
      );

      const message = enriched.rows[0];

      // === REAL-TIME BROADCAST ===
      const io = req.app.get("io");
      if (io) {
        io.to(`user_${receiver_id}`).emit("new_message", message);
        io.to(`user_${sender_id}`).emit("new_message", message);

        console.log(`📩 Message sent in real-time to users ${sender_id} & ${receiver_id}`);
      }

      res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: message,
      });
    } catch (err) {
      console.error("❌ Error sending message:", err.message);
      res.status(500).json({ success: false, message: "Server error sending message" });
    }
  },

  // Delete a message
  deleteMessage: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        "DELETE FROM messages WHERE id = $1 RETURNING sender_id, receiver_id",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Message not found" });
      }

      const { sender_id, receiver_id } = result.rows[0];

      // Notify both users of deletion
      const io = req.app.get("io");
      if (io) {
        io.to(`user_${sender_id}`).emit("message_deleted", { messageId: id });
        io.to(`user_${receiver_id}`).emit("message_deleted", { messageId: id });
      }

      res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting message:", err.message);
      res.status(500).json({ success: false, message: "Server error deleting message" });
    }
  },
};

module.exports = messageController;
