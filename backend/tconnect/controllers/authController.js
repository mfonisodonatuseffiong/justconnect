const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  addUser,
  getUserByEmail,
  updateUserPassword,
  saveResetToken,
  findUserByResetToken,
  clearResetToken,
} = require("../models/User");

require("dotenv").config();

// ✅ Generate JWT including name and email
const generateToken = (id, name, email, role) => {
  return jwt.sign({ id, name, email, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  try {
    const userExists = await getUserByEmail(email);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await addUser(name, email, hashedPassword, role);
    const user = newUser.rows[0];

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.name, user.email, user.role),
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await getUserByEmail(email);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.name, user.email, user.role),
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

/**
 * @desc    Logout user (client should just delete token)
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logoutUser = async (req, res) => {
  try {
    // Stateless JWT: logout is handled client-side (token removed from storage)
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Server error during logout" });
  }
};

/**
 * @desc    Forgot Password - send reset token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const userResult = await getUserByEmail(email);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "No user with that email" });
    }

    const user = userResult.rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

    await saveResetToken(user.id, resetToken, expiry);

    // TODO: Send this via email in real app
    console.log(`Password reset link: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`);

    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res.status(500).json({ error: "Server error during forgot password" });
  }
};

/**
 * @desc    Reset Password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const userResult = await findUserByResetToken(token);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = userResult.rows[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await updateUserPassword(user.id, hashedPassword);
    await clearResetToken(user.id);

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error during reset password:", error);
    res.status(500).json({ error: "Server error during reset password" });
  }
};
