/**
 * @description Endpoint for categories fetching
 */

const { pool } = require("../config/db");

const getAllCategoriesController = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name FROM categories ORDER BY name ASC"
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("❌ Error fetching categories:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

module.exports = { getAllCategoriesController };