// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const pool = require("../config/db");

// Middleware for file upload
router.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    abortOnLimit: true,
    responseOnLimit: "File size limit has been reached",
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
router.use("/uploads", express.static(uploadsDir));

// Upload profile picture
router.post("/profile", authenticateToken, async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.files || !req.files.profile_picture) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please use field name 'profile_picture'",
      });
    }

    const file = req.files.profile_picture;
    const fileExt = path.extname(file.name).toLowerCase();
    const allowedExt = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    if (!allowedExt.includes(fileExt)) {
      return res.status(400).json({
        success: false,
        message: "Only image files (jpg, jpeg, png, gif, webp) are allowed",
      });
    }

    // Generate unique filename
    const fileName = `profile-${req.user.id}-${Date.now()}${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);

    // Move file from temp to uploads folder
    await file.mv(filePath);

    // ✅ CRITICAL FIX: Return FULL URL so frontend can load it correctly
    const profilePictureUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;

    // Update user in database
    await pool.query(
      "UPDATE users SET profile_picture = $1 WHERE id = $2",
      [profilePictureUrl, req.user.id]
    );

    return res.json({
      success: true,
      message: "Profile picture uploaded successfully",
      profile_picture: profilePictureUrl, // Full URL: http://localhost:5000/uploads/...
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during upload",
      error: err.message,
    });
  }
});

module.exports = router;