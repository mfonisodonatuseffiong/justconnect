// controllers/authController.js
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
const { generateAccessToken } = require("../utils/token-generator");
const { safeUserPayload } = require("../utils/authUserSafePayload");

const { pool } = require("../config/db");
const {
  addUser,
  getUserByEmail,
  updateUserPassword,
  saveResetToken,
  findUserByResetToken,
  clearResetToken,
  checkEmailExists,
  createProfessional,
} = require("../models/User");

const authController = {
  /* ====== REGISTER ======== */
  register: async (req, res) => {
    try {
      const { name, email, password, role, location, category_id } = req.body;
      // Validate Input
      if (!name || !email || !password || !role) {
        return res
          .status(400)
          .json({ message: "Name, email, password, role are required" });
      }
      // Validate email address
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }
      // Validate password length
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      // Validate role
      const allowedRoles = ["user", "professional"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role selected",
        });
      }

      // Validate the professionals filled their forms all
      if (role === "professional") {
        if (!category_id || !location) {
          return res.status(400).json({
            success: false,
            message: "Category and location are required for professionals",
          });
        }
      }

      // Check if email already exist
      const existingUser = await checkEmailExists(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Add the new user to database
      const user = await addUser({
        name,
        email,
        password: hashedPassword,
        role,
        location,
      });

      // If professional, save extra details into professional table
      let professional = null;

      if (role === "professional") {
        professional = await createProfessional({
          user_id: user.id,
          category_id,
        });
      }

      // TODO: Email function to send user a successful account creation and steps to verify their account.

      // Return the response to forward
      return res.status(201).json({
        success: true,
        message:
          "Account created successfully. Please check your email for further steps to verify your account.",
        data: { user, professional },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  /* ======= LOGIN =========== */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res
          .status(400)
          .json({ success: false, message: "email and password required" });

      const user = await getUserByEmail(email);
      if (!user)
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password." });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password." });

      // Generate Token password
      const accessToken = generateAccessToken(user);

      // send jwt to cookies (key name, the token, and the setup)
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24hrs
        path: "/",
      });

      return res.json({
        success: true,
        message: "Login successful",
        user: safeUserPayload(user),
      });
    } catch (err) {
      console.error("❌ Login error:", err);
      return res.status(500).json({ error: "Server error during login." });
    }
  },

  /* ====== LOGOUT ========= */
  logout: async (req, res) => {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24hrs
        path: "/",
      });
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (err) {
      console.error("❌ Logout error:", err);
      return res.status(500).json({ error: "Server error during logout." });
    }
  },

  /* ==== GET PROFILE (/auth/me) ========== */
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      const result = await pool.query(
        `SELECT u.id, u.name, u.email, u.role,
                u.profile_picture, u.phone, u.sex, u.address, u.location, u.is_verified,
                p.category_id, p.bio, p.rating, p.experience_years, p.service_area, p.is_available
        FROM users u
        LEFT JOIN professionals p ON p.user_id = u.id
        WHERE u.id = $1
        LIMIT 1`,
        [userId],
      );
      const user = result.rows[0];
      if (!user) return res.status(404).json({ message: "User not found" });

      return res.json({ success: true, user: safeUserPayload(user) });
    } catch (err) {
      console.error("❌ Get profile error:", err);
      return res
        .status(500)
        .json({ error: "Server error while fetching profile." });
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
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      const expiry = new Date(Date.now() + 10 * 60 * 1000);

      await saveResetToken(user.id, hashedToken, expiry);

      const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

      return res.json({ message: "Password reset link generated", resetUrl });
    } catch (err) {
      console.error("❌ Forgot password error:", err);
      return res
        .status(500)
        .json({ error: "Server error during forgot password." });
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

      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      const user = await findUserByResetToken(hashedToken);
      if (!user)
        return res.status(400).json({ message: "Invalid or expired token" });

      const hashedPassword = await bcrypt.hash(password, 12);
      await updateUserPassword(user.id, hashedPassword);
      await clearResetToken(user.id);

      return res.json({ message: "Password reset successful" });
    } catch (err) {
      console.error("❌ Reset password error:", err);
      return res
        .status(500)
        .json({ error: "Server error during password reset." });
    }
  },
};

module.exports = authController;
