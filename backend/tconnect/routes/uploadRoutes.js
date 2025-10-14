const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../../config/cloudinary");
const pool = require("../../db");
const fs = require("fs");

// 📁 Setup Multer to store uploaded files temporarily
const upload = multer({ dest: "uploads/" });

// ✅ Upload profile picture
router.post("/upload/profile-photo", upload.single("photo"), async (req, res) => {
  try {
    const { userId } = req.body; // ID of the professional or user
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // ☁️ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "justconnect/profile_photos",
      transformation: [{ width: 400, height: 400, crop: "fill" }],
    });

    // 🧹 Delete temp file after upload
    fs.unlinkSync(req.file.path);

    // 🗄️ Save URL in professionals table
    await pool.query(
      `UPDATE professionals SET profile_photo = $1 WHERE id = $2`,
      [result.secure_url, userId]
    );

    res.status(200).json({
      message: "Profile photo uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

module.exports = router;
