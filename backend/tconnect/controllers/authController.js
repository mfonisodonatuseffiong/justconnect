const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { addUser, getUserByEmail } = require("../models/User");
require("dotenv").config();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await getUserByEmail(email);
    if (userExists.rows.length > 0) {
      console.log("Registration failed: user already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await addUser(name, email, hashedPassword, role);

    console.log("User registered successfully:", email);

    res.status(201).json({
      id: newUser.rows[0].id,
      name: newUser.rows[0].name,
      email: newUser.rows[0].email,
      role: newUser.rows[0].role,
      token: generateToken(newUser.rows[0].id, newUser.rows[0].role),
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt received:", { email });

  try {
    const user = await getUserByEmail(email);
    console.log("User query result:", user.rows);

    if (user.rows.length === 0) {
      console.log("Login failed: no user with email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      console.log("Login failed: invalid password for email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Login successful for user:", email);

    res.json({
      id: user.rows[0].id,
      name: user.rows[0].name,
      email: user.rows[0].email,
      role: user.rows[0].role,
      token: generateToken(user.rows[0].id, user.rows[0].role),
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};
