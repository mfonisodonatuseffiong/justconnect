const pool = require("../../db");

const createUserTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'user'
    )
  `);
};

createUserTable();

const addUser = async (name, email, hashedPassword, role) => {
  return pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, hashedPassword, role]
  );
};

const getUserByEmail = async (email) => {
  return pool.query("SELECT * FROM users WHERE email = $1", [email]);
};

module.exports = { addUser, getUserByEmail };
