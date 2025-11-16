const pool = require("../config/db");

const createProfessional = async (req, res) => {
  try {
    const { name, email, password, category, location, experience } = req.body;
    const result = await pool.query(
      "INSERT INTO professionals(name,email,password,category,location,experience) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
      [name, email, password, category, location, experience]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllProfessionals = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM professionals");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProfessionalById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM professionals WHERE id=$1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfessional = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, category, location, experience } = req.body;
    const result = await pool.query(
      "UPDATE professionals SET name=$1,email=$2,category=$3,location=$4,experience=$5 WHERE id=$6 RETURNING *",
      [name, email, category, location, experience, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProfessional = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM professionals WHERE id=$1", [id]);
    res.json({ message: "Professional deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProfessional,
  getAllProfessionals,
  getProfessionalById,
  updateProfessional,
  deleteProfessional,
};
