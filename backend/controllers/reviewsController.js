// controllers/reviewsController.js
const pool = require("../config/db");

exports.addReview = async (req, res) => {
  try {
    const { user_id, professional_id, rating, comment } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO reviews (user_id, professional_id, rating, comment, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [user_id, professional_id, rating, comment]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding review" });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.*, u.name AS user_name, p.name AS professional_name
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN professionals p ON r.professional_id = p.id
       ORDER BY r.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
};
