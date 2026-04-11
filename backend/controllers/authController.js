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
  /* ===========================
     REGISTER
  ============================ */
  register: async (req, res) => {
    try {
      const { name, email, password, role, location, category_id } = req.body;
      // Validate Input
      if ((!name || !email || !password || !role)) {
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
      const user = await addUser({name, email, password: hashedPassword, role, location});

      // If professional, save extra details into professional table
      let professional = null;

      if (role === "professional") {
        professional = await createProfessional({
          user_id: user.id,
          category_id,
        });
      }

      // Return the response to forward
      return res.status(201).json({
        success: true,
        message: "Account created successfully",
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

  /* ===========================
     LOGIN
  ============================ */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ message: "email and password required" });

      const userRow = await getUserByEmail(email);
      if (!userRow)
        return res.status(401).json({ message: "Invalid email or password." });

      const validPassword = await bcrypt.compare(password, userRow.password);
      if (!validPassword)
        return res.status(401).json({ message: "Invalid email or password." });

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
            userRow.contact || userRow.phone,
          ],
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
      res.clearCookie("token");
      if (req.session) {
        req.session.destroy((err) => {
          if (err) console.error("❌ Session destroy error:", err);
        });
      }
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

  /* ===========================
     GET PROFILE (/auth/me)
  ============================ */
  getProfile: async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, name, email, role, profile_picture, sex, location, phone, address, updated_at
         FROM users WHERE id = $1`,
        [req.user.id],
      );
      const userRow = result.rows[0];
      if (!userRow) return res.status(404).json({ message: "User not found" });

      let profData = null;
      if (userRow.role === "professional") {
        const proRes = await pool.query(
          "SELECT category, location, contact FROM professionals WHERE LOWER(email) = LOWER($1) LIMIT 1",
          [userRow.email],
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
      return res
        .status(500)
        .json({ error: "Server error while fetching profile." });
    }
  },
};

module.exports = authController;
