// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const pool = require("../config/db");
const {
  addUser,
  getUserByEmail,
  updateUserPassword,
  saveResetToken,
  findUserByResetToken,
  clearResetToken,
} = require("../models/User");

/* ======================================================
   ACCESS TOKEN (24 HOURS)
====================================================== */
const generateAccessToken = (user) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");

  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
      issuer: "justconnect.app",
      audience: "justconnect-users",
    }
  );
};

/* ======================================================
   SAFE USER DATA
   Always return a consistent shape for the frontend
====================================================== */
const safeUserPayload = (userRow) => {
  if (!userRow) return null;

  return {
    id: userRow.id,
    name: userRow.name,
    email: userRow.email,
    role: userRow.role,
    profile_picture: userRow.profile_picture || null,
    sex: userRow.sex || null,
    category: userRow.category || null,
    location: userRow.location || null,
    phone: userRow.phone || null,
    contact: userRow.contact || null,
    updated_at: userRow.updated_at || null,
  };
};

/* ======================================================
   AUTH CONTROLLER
====================================================== */
const authController = {
  /* ===========================
     REGISTER
  ============================ */
  register: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        role = "user",
        profile_picture = null,
        sex = null,
        category = null,
        location = null,
        phone = null,
        contact = null,
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "name, email and password are required" });
      }

      const allowedRoles = ["user", "professional", "admin"];
      const finalRole = allowedRoles.includes(role) ? role : "user";

      const existing = await getUserByEmail(email);
      if (existing) return res.status(400).json({ message: "User already exists." });

      const hashedPassword = await bcrypt.hash(password, 12);

      await addUser(name, email, hashedPassword, finalRole, profile_picture, sex);

      // Auto-create professional entry
      if (finalRole === "professional") {
        await pool.query(
          `INSERT INTO professionals (name, email, category, location, contact)
           VALUES ($1,$2,$3,$4,$5)
           ON CONFLICT (email) DO UPDATE
           SET category = COALESCE(EXCLUDED.category, professionals.category),
               location = COALESCE(EXCLUDED.location, professionals.location),
               contact = COALESCE(EXCLUDED.contact, professionals.contact)`,
          [name, email, category || "General Service", location || "Unknown", contact || null]
        );
      }

      const userRow = await getUserByEmail(email);
      const accessToken = generateAccessToken(userRow);

      return res.status(201).json({
        message: "Registration successful",
        user: safeUserPayload(userRow),
        accessToken,
      });
    } catch (err) {
      console.error("❌ Registration error:", err);
      return res.status(500).json({ error: "Server error during registration." });
    }
  },

  /* ===========================
     LOGIN
  ============================ */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ message: "email and password required" });

      const userRow = await getUserByEmail(email);
      if (!userRow) return res.status(401).json({ message: "Invalid email or password." });

      const validPassword = await bcrypt.compare(password, userRow.password);
      if (!validPassword) return res.status(401).json({ message: "Invalid email or password." });

      // Ensure professional exists
      if (userRow.role === "professional") {
        await pool.query(
          `INSERT INTO professionals (name,email,category,location,contact)
           VALUES ($1,$2,$3,$4,$5)
           ON CONFLICT(email) DO NOTHING`,
          [
            userRow.name,
            userRow.email,
            userRow.category || "General Service",
            userRow.location || "Unknown",
            userRow.contact || null,
          ]
        );
      }

      const accessToken = generateAccessToken(userRow);

      return res.json({
        message: "Login successful",
        user: safeUserPayload(userRow),
        accessToken,
      });
    } catch (err) {
      console.error("❌ Login error:", err);
      return res.status(500).json({ error: "Server error during login." });
    }
  },

  /* ===========================
     LOGOUT
  ============================ */
  logout: async (req, res) => {
    try {
      // Clear JWT cookie if present
      res.clearCookie("token");

      // Destroy session if using express-session
      if (req.session) {
        req.session.destroy(err => {
          if (err) {
            console.error("❌ Session destroy error:", err);
          }
        });
      }

      // Redirect to hero section (main page)
      return res.redirect("/");
    } catch (err) {
      console.error("❌ Logout error:", err);
      return res.status(500).json({ error: "Server error during logout." });
    }
  },

  /* ===========================
     FORGOT PASSWORD
  ============================ */
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) return res.status(400).json({ message: "email is required" });

      const user = await getUserByEmail(email);
      if (!user) return res.status(404).json({ message: "User not found" });

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      const expiry = new Date(Date.now() + 10 * 60 * 1000);

      await saveResetToken(user.id, hashedToken, expiry);

      const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

      return res.json({ message: "Password reset link generated", resetUrl });
    } catch (err) {
      console.error("❌ Forgot password error:", err);
      return res.status(500).json({ error: "Server error during forgot password." });
    }
  },

  /* ===========================
     RESET PASSWORD
  ============================ */
  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password)
        return res.status(400).json({ message: "token and password required" });

      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
      const user = await findUserByResetToken(hashedToken);

      if (!user) return res.status(400).json({ message: "Invalid or expired token" });

      const hashedPassword = await bcrypt.hash(password, 12);

      await updateUserPassword(user.id, hashedPassword);
      await clearResetToken(user.id);

      return res.json({ message: "Password reset successful" });
    } catch (err) {
      console.error("❌ Reset password error:", err);
      return res.status(500).json({ error: "Server error during password reset." });
    }
  },

  /* ===========================
     GET PROFILE (/auth/me)
  ============================ */
  getProfile: async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, name, email, role, profile_picture, sex, location, phone, updated_at
         FROM users WHERE id = $1`,
        [req.user.id]
      );
      const userRow = result.rows[0];
      if (!userRow) return res.status(404).json({ message: "User not found" });

      let profData = null;
      if (userRow.role === "professional") {
        const proRes = await pool.query(
          "SELECT category, location, contact FROM professionals WHERE LOWER(email) = LOWER($1) LIMIT 1",
          [userRow.email]
        );
        if (proRes.rows.length > 0) profData = proRes.rows[0];
      }

      const payload = safeUserPayload({
        ...userRow,
        category: profData?.category,
        location: profData?.location || userRow.location,
        contact: profData?.contact || userRow.phone,
      });

      return res.json({ success: true, user: payload });
    } catch (err) {
      console.error("❌ Get profile error:", err);
      return res.status(500).json({ error: "Server error while fetching profile." });
    }
  },
};

/* Dashboard compatibility */
authController.getUserProfileBy
module.exports = authController;
