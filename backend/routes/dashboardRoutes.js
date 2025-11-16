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

// ✅ Unified dashboard (auto-detects role: user or professional)
router.get("/", authenticateToken, getDashboard);

// ✅ Professional-specific dashboard
router.get("/professional-dashboard", authenticateToken, getProfessionalDashboard);

// ✅ User-specific dashboard
router.get("/user-dashboard", authenticateToken, authorizeRoles("user"), getUserDashboard);

// ✅ Upload profile photo (professionals only)
router.post(
  "/upload/profile-photo",
  authenticateToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      const user = req.user;

      if (user.role !== "professional") {
        return res
          .status(403)
          .json({ message: "Only professionals can upload profile photos" });
      }

      const imageUrl = req.file.path;

      await pool.query(
        "UPDATE professionals SET profile_photo = $1 WHERE email = $2",
        [imageUrl, user.email]
      );

      res.json({
        message: "Profile photo uploaded successfully!",
        photoUrl: imageUrl,
      });
    } catch (error) {
      console.error("❌ Upload error:", error);
      res.status(500).json({ message: "Server error uploading photo" });
    }
  }
);

// ✅ Create a new service request (users only)
router.post("/", authenticateToken, authorizeRoles("user"), createRequest);

// ✅ Update a request’s status (professionals or admin)
router.patch("/:id/status", authenticateToken, updateRequestStatus);

// ====================================================
// EXPORT ROUTER
// ====================================================
module.exports = router;
