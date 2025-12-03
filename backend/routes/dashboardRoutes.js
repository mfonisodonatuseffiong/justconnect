// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");
const {
  getDashboard,
  getProfessionalDashboard,
  getUserDashboard,
  createRequest,
  updateRequestStatus,
} = require("../controllers/dashboardController");
const pool = require("../config/db");

// ====================================================
// CLOUDINARY CONFIGURATION
// ====================================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage setup for profile photo uploads
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "justconnect/profiles",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });

// ====================================================
// ROUTES
// ====================================================

// Unified dashboard
router.get("/", authenticateToken, getDashboard);

// Professional dashboard
router.get("/professional", authenticateToken, getProfessionalDashboard);

// User dashboard
router.get("/user", authenticateToken, authorizeRoles("user"), getUserDashboard);

// ====================================================
// UPDATED: Upload profile photo (users + professionals)
// ====================================================
router.post(
  "/upload/profile-photo",
  authenticateToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      const user = req.user;

      // Ensure photo exists
      if (!req.file) {
        return res.status(400).json({ message: "No photo uploaded" });
      }

      const imageUrl = req.file.path;

      // Save in the correct table
      if (user.role === "professional") {
        await pool.query(
          "UPDATE professionals SET profile_photo = $1 WHERE email = $2",
          [imageUrl, user.email]
        );
      } else if (user.role === "user") {
        await pool.query(
          "UPDATE users SET profile_pic = $1 WHERE email = $2",
          [imageUrl, user.email]
        );
      }

      res.json({
        message: "Profile photo uploaded successfully!",
        role: user.role,
        photoUrl: imageUrl,
      });
    } catch (error) {
      console.error("❌ Upload error:", error);
      res.status(500).json({ message: "Server error uploading photo" });
    }
  }
);

// Create a new service request (users only)
router.post("/", authenticateToken, authorizeRoles("user"), createRequest);

// Update a request’s status (professionals or admin)
router.patch("/:id/status", authenticateToken, updateRequestStatus);

// ====================================================
// EXPORT ROUTER
// ====================================================
module.exports = router;
