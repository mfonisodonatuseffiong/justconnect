// controllers/notificationController.js
const pool = require("../config/db");

const notificationController = {
  // Get notifications for a specific user
  getUserNotifications: async (req, res) => {
    try {
      const { userId } = req.params;

      const result = await pool.query(
        `SELECT n.*, 
                sender.name AS sender_name 
         FROM notifications n
         LEFT JOIN users sender ON n.sender_id = sender.id
         WHERE n.user_id = $1 
         ORDER BY n.created_at DESC`,
        [userId]
      );

      res.status(200).json({
        success: true,
        data: result.rows,
      });
    } catch (err) {
      console.error("❌ Error fetching notifications:", err.message);
      res.status(500).json({
        success: false,
        message: "Server error fetching notifications",
      });
    }
  },

  // Mark a notification as read + real-time update
  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `UPDATE notifications 
         SET read = true, updated_at = NOW() 
         WHERE id = $1 
         RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      const updatedNotification = result.rows[0];

      // === REAL-TIME BROADCAST ===
      const io = req.app.get("io");
      if (io) {
        io.to(`user_${updatedNotification.user_id}`).emit("notification_updated", {
          id: updatedNotification.id,
          read: true,
        });
        console.log(`🔔 Notification ${id} marked as read for user ${updatedNotification.user_id}`);
      }

      res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: updatedNotification,
      });
    } catch (err) {
      console.error("❌ Error marking notification as read:", err.message);
      res.status(500).json({
        success: false,
        message: "Server error updating notification",
      });
    }
  },

  // Delete a notification + real-time update
  deleteNotification: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        "DELETE FROM notifications WHERE id = $1 RETURNING user_id",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      const { user_id } = result.rows[0];

      // === REAL-TIME BROADCAST ===
      const io = req.app.get("io");
      if (io) {
        io.to(`user_${user_id}`).emit("notification_deleted", { id });
        console.log(`🗑️ Notification ${id} deleted for user ${user_id}`);
      }

      res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
      });
    } catch (err) {
      console.error("❌ Error deleting notification:", err.message);
      res.status(500).json({
        success: false,
        message: "Server error deleting notification",
      });
    }
  },
};

module.exports = notificationController;