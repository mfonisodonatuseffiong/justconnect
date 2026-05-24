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

// Unified dashboard (admin/global overview)
router.get("/", authenticateToken, getDashboard);

// Professional dashboard overview
router.get("/professional", authenticateToken, getProfessionalDashboard);

// User dashboard overview (with userId param)
router.get(
  "/user/:userId",
  authenticateToken,
  authorizeRoles("user"),
  getUserDashboard
);

// Upload profile photo (users + professionals)
router.post(
  "/upload/profile-photo",
  authenticateToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      const user = req.user;

      if (!req.file) {
        return res.status(400).json({ message: "No photo uploaded" });
      }

      const imageUrl = req.file.path;

      // Update profile picture in users table (covers both users and professionals)
      await pool.query(
        "UPDATE users SET profile_picture = $1 WHERE id = $2",
        [imageUrl, user.id]
      );

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

// Create a new service request (users only) — placeholder
router.post("/", authenticateToken, authorizeRoles("user"), createRequest);

// Update a request’s status (professionals or admin) — placeholder
router.patch("/:id/status", authenticateToken, updateRequestStatus);

// ====================================================
// EXPORT ROUTER
// ====================================================
module.exports = router;
