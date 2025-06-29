const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");

router.get("/", protect, (req, res) => {
  res.json({
    message: `Welcome to your dashboard, ${req.user.role === 'admin' ? 'Admin' : 'User'}!`,
    user: req.user,
  });
});

module.exports = router;
