const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const pool = require("../config/db");
const cloudinary = require("../config/cloudinary");
const {
  addUser,
  getUserByEmail,
  updateUserPassword,
  saveResetToken,
  findUserByResetToken,
  clearResetToken,
} = require("../models/User");

/**
 * ==========================================================
 * TOKEN GENERATION UTILITY
 * ==========================================================
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
    issuer: "justconnect.app",
    audience: "justconnect-users",
  });
};

/**
 * ==========================================================
 * AUTH CONTROLLER
 * ==========================================================
 */
const authController = {
  /**
   * ==========================================================
   * REGISTER USER / PROFESSIONAL
   * ==========================================================
   */
  register: async (req, res) => {
    const { name, email, password, role, category, location, contact } = req.body;

    try {
      const validRoles = ["user", "professional", "admin"];
      if (role && !validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role specified." });
      }

      const existing = await getUserByEmail(email);
      if (existing.rows.length > 0) {
        return res.status(400).json({ message: "User already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await addUser(name, email, hashedPassword, role || "user");
      const user = newUser.rows[0];

      // 🧰 Automatically insert professionals into the professionals table
      if ((role || "user") === "professional") {
        await pool.query(
          `INSERT INTO professionals (name, email, category, location, contact)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (email) DO NOTHING`,
          [name, email, category || "General Service", location || "Unknown", contact || null]
        );
      }

      // 🪪 Create JWT token (include name and role)
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      const token = generateToken(payload);

      // 🍪 Set secure cookie and respond
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json({
          message: "Registration successful",
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
          token,
        });
    } catch (error) {
      console.error("❌ Registration error:", error);
      res.status(500).json({ error: "Server error during registration." });
    }
  },

  /**
   * ==========================================================
   * LOGIN USER / PROFESSIONAL
   * ==========================================================
   */
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const userResult = await getUserByEmail(email);
      if (userResult.rows.length === 0) {
        return res.status(401).json({ message: "No account found. Please sign up." });
      }

      const user = userResult.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      // 🧰 Ensure professional info exists in professionals table
      if (user.role === "professional") {
        await pool.query(
          `INSERT INTO professionals (name, email, category, location, contact)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (email) DO NOTHING`,
          [user.name, user.email, "General Service", "Unknown", null]
        );
      }

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      const token = generateToken(payload);

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          message: "Login successful",
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
          token,
        });
    } catch (error) {
      console.error("❌ Login error:", error);
      res.status(500).json({ error: "Server error during login." });
    }
  },

  /**
   * ==========================================================
   * LOGOUT USER
   * ==========================================================
   */
  logout: async (req, res) => {
    try {
      res.clearCookie("token");
      res.json({ message: "Logged out successfully." });
    } catch (error) {
      console.error("❌ Logout error:", error);
      res.status(500).json({ error: "Server error during logout." });
    }
  },

  /**
   * ==========================================================
   * FORGOT PASSWORD
   * ==========================================================
   */
  forgotPassword: async (req, res) => {
    const { email } = req.body;

    try {
      const userResult = await getUserByEmail(email);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "No user found with that email." });
      }

      const user = userResult.rows[0];
      const resetToken = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

      await saveResetToken(user.id, resetToken, expiry);

      console.log(`🔗 Password Reset Link: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`);

      res.json({
        message: "Password reset link sent to your email (check console for now).",
      });
    } catch (error) {
      console.error("❌ Forgot password error:", error);
      res.status(500).json({ error: "Server error during forgot password." });
    }
  },

  /**
   * ==========================================================
   * RESET PASSWORD
   * ==========================================================
   */
  resetPassword: async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      const userResult = await findUserByResetToken(token);
      if (userResult.rows.length === 0) {
        return res.status(400).json({ message: "Invalid or expired reset token." });
      }

      const user = userResult.rows[0];
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await updateUserPassword(user.id, hashedPassword);
      await clearResetToken(user.id);

      res.json({ message: "Password reset successful." });
    } catch (error) {
      console.error("❌ Reset password error:", error);
      res.status(500).json({ error: "Server error during password reset." });
    }
  },

  /**
   * ==========================================================
   * GET PROFILE (Authenticated User)
   * ==========================================================
   */
  getProfile: async (req, res) => {
    try {
      const userResult = await getUserByEmail(req.user.email);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      const user = userResult.rows[0];
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("❌ Get profile error:", error);
      res.status(500).json({ error: "Server error while fetching profile." });
    }
  },
};

module.exports = authController;
