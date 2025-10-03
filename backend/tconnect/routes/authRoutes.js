const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser); // logout is protected
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
