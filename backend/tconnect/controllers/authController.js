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

/**
 * ✅ Generate JWT with role, name, and email
 */
const generateToken = (id, name, email, role) => {
  return jwt.sign({ id, name, email, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

/**
 * ✅ Register a new user or professional
 * @route POST /api/v1/auth/register
 */
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const validRoles = ["user", "professional"];
    if (role && !validRoles.includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Must be either 'user' or 'professional'." });
    }

    const userRole = role || "user";

    const existing = await getUserByEmail(email);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await addUser(name, email, hashedPassword, userRole);
    const user = newUser.rows[0];

    const token = generateToken(user.id, user.name, user.email, user.role);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // set true in production with HTTPS
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "Registration successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
  } catch (error) {
    console.error("❌ Error during registration:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

/**
 * ✅ Login user or professional
 * @route POST /api/v1/auth/login
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await getUserByEmail(email);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Kindly sign up to continue" });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id, user.name, user.email, user.role);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

/**
 * ✅ Logout user (clear cookie)
 * @route POST /api/v1/auth/logout
 */
exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("❌ Error during logout:", error);
    res.status(500).json({ error: "Server error during logout" });
  }
};

/**
 * ✅ Forgot Password (send reset token)
 * @route POST /api/v1/auth/forgot-password
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const userResult = await getUserByEmail(email);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    const user = userResult.rows[0];
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await saveResetToken(user.id, resetToken, expiry);

    console.log(`🔗 Reset Link: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`);

    res.json({
      message: "Password reset link sent to email (check console for demo)",
    });
  } catch (error) {
    console.error("❌ Error during forgot password:", error);
    res.status(500).json({ error: "Server error during forgot password" });
  }
};

/**
 * ✅ Reset Password
 * @route POST /api/v1/auth/reset-password
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
    console.error("❌ Error during reset password:", error);
    res.status(500).json({ error: "Server error during reset password" });
  }
};

/**
 * ✅ Get Authenticated User (keep user logged in on page reload)
 * @route GET /api/v1/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userResult = await getUserByEmail(decoded.email);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
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
    console.error("❌ Error fetching user data:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
