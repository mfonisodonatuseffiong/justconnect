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
  getUserById,
  updateUserPassword,
  saveResetToken,
  findUserByResetToken,
  clearResetToken,
  saveRefreshToken,
  getUserByRefreshToken,
  clearRefreshToken,
  updateRefreshToken,
} = require("../models/User");

// ---------------------
// Token generators
// ---------------------
const generateAccessToken = (user) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m", issuer: "justconnect.app", audience: "justconnect-users" }
  );
};

const generateRefreshToken = (user) => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_REFRESH_SECRET not set");
  return jwt.sign({ id: user.id }, secret, {
    expiresIn: "7d",
    issuer: "justconnect.app",
    audience: "justconnect-users",
  });
};

// ---------------------
// Helper
// ---------------------
const safeUserPayload = (userRow) => {
  if (!userRow) return null;
  return {
    id: userRow.id,
    name: userRow.name,
    email: userRow.email,
    role: userRow.role,
    profile_pic: userRow.profile_pic || null,
    sex: userRow.sex || null,
    category: userRow.category || null,
    location: userRow.location || null,
    contact: userRow.contact || null,
  };
};

// ---------------------
// Controller
// ---------------------
const authController = {
  // Register
  register: async (req, res) => {
    try {
      const { name, email, password, role = "user", profile_pic = null, sex = null, category = null, location = null, contact = null } = req.body;

      if (!name || !email || !password) return res.status(400).json({ message: "name, email and password are required" });

      const allowedRoles = ["user", "professional", "admin"];
      const finalRole = allowedRoles.includes(role) ? role : "user";

      const existing = await getUserByEmail(email);
      if (existing) return res.status(400).json({ message: "User already exists." });

      const hashedPassword = await bcrypt.hash(password, 12);
      const created = await addUser(name, email, hashedPassword, finalRole, profile_pic, sex);

      // Ensure professional table entry
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
      const refreshToken = generateRefreshToken(userRow);
      await saveRefreshToken(userRow.id, refreshToken);

      res
        .cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 15 * 60 * 1000 })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 7 * 24 * 60 * 60 * 1000 })
        .status(201)
        .json({ message: "Registration successful", user: safeUserPayload(userRow), accessToken, refreshToken });
    } catch (err) {
      console.error("❌ Registration error:", err);
      res.status(500).json({ error: "Server error during registration." });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: "email and password required" });

      const userRow = await getUserByEmail(email);
      if (!userRow) return res.status(401).json({ message: "Invalid email or password." });

      const validPassword = await bcrypt.compare(password, userRow.password);
      if (!validPassword) return res.status(401).json({ message: "Invalid email or password." });

      if (userRow.role === "professional") {
        await pool.query(
          `INSERT INTO professionals (name,email,category,location,contact) VALUES ($1,$2,$3,$4,$5) ON CONFLICT(email) DO NOTHING`,
          [userRow.name, userRow.email, userRow.category || "General Service", userRow.location || "Unknown", userRow.contact || null]
        );
      }

      const accessToken = generateAccessToken(userRow);
      const refreshToken = generateRefreshToken(userRow);
      await saveRefreshToken(userRow.id, refreshToken);

      res
        .cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 15 * 60 * 1000 })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 7 * 24 * 60 * 60 * 1000 })
        .status(200)
        .json({ message: "Login successful", user: safeUserPayload(userRow), accessToken, refreshToken });
    } catch (err) {
      console.error("❌ Login error:", err);
      res.status(500).json({ error: "Server error during login." });
    }
  },

  // Logout
  logout: async (req, res) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        const user = await getUserByRefreshToken(refreshToken);
        if (user) await clearRefreshToken(user.id);
      }
      res.clearCookie("accessToken").clearCookie("refreshToken").json({ message: "Logged out successfully." });
    } catch (err) {
      console.error("❌ Logout error:", err);
      res.status(500).json({ error: "Server error during logout." });
    }
  },

  // Refresh token
  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) return res.status(401).json({ message: "No refresh token provided." });

      const storedUser = await getUserByRefreshToken(refreshToken);
      if (!storedUser) return res.status(403).json({ message: "Invalid refresh token." });

      const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
      try {
        jwt.verify(refreshToken, secret);
      } catch {
        await clearRefreshToken(storedUser.id).catch(() => {});
        return res.status(403).json({ message: "Invalid refresh token." });
      }

      const accessToken = generateAccessToken(storedUser);

      res.cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 15 * 60 * 1000 }).json({ message: "Access token refreshed", accessToken });
    } catch (err) {
      console.error("❌ Refresh token error:", err);
      res.status(500).json({ error: "Server error during token refresh." });
    }
  },

  // Forgot password
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
      console.log("🔗 Password reset:", resetUrl);

      res.json({ message: "Password reset link generated", resetUrl });
    } catch (err) {
      console.error("❌ Forgot password error:", err);
      res.status(500).json({ error: "Server error during forgot password." });
    }
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) return res.status(400).json({ message: "token and password required" });

      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
      const user = await findUserByResetToken(hashedToken);
      if (!user) return res.status(400).json({ message: "Invalid or expired token" });

      const hashedPassword = await bcrypt.hash(password, 12);
      await updateUserPassword(user.id, hashedPassword);
      await clearResetToken(user.id);

      res.json({ message: "Password reset successful" });
    } catch (err) {
      console.error("❌ Reset password error:", err);
      res.status(500).json({ error: "Server error during password reset." });
    }
  },

  // Get profile
  getProfile: async (req, res) => {
    try {
      const userRow = await getUserById(req.user.id);
      if (!userRow) return res.status(404).json({ message: "User not found" });

      let profData = null;
      if (userRow.role === "professional") {
        const proRes = await pool.query("SELECT category, location, contact FROM professionals WHERE LOWER(email) = LOWER($1) LIMIT 1", [userRow.email]);
        if (proRes.rows.length > 0) profData = proRes.rows[0];
      }

      const payload = safeUserPayload({ ...userRow, category: profData?.category, location: profData?.location, contact: profData?.contact });
      res.json(payload);
    } catch (err) {
      console.error("❌ Get profile error:", err);
      res.status(500).json({ error: "Server error while fetching profile." });
    }
  },
};

module.exports = authController;
