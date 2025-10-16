const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../../config/cloudinary");
const pool = require("../../db");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// 📁 Temporary storage for uploads
const upload = multer({ dest: "uploads/" });

// ✅ Upload profile photo (for both users & professionals)
router.post("/upload/profile-photo", upload.single("photo"), async (req, res) => {
  try {
    // ✅ Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing token" });
    }

    // 🧠 Verify JWT token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const userRole = decoded.role;

    // 🖼 Ensure file is provided
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ☁️ Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "justconnect/profile_photos",
      transformation: [{ width: 400, height: 400, crop: "fill" }],
    });

    // 🧹 Remove temp file
    fs.unlinkSync(req.file.path);

    // 🗄️ Update correct table based on role
    let tableName = userRole === "professional" ? "professionals" : "users";

    await pool.query(
      `UPDATE ${tableName} SET profile_photo = $1 WHERE id = $2`,
      [result.secure_url, userId]
    );

    res.status(200).json({
      message: `Profile photo uploaded successfully for ${userRole}`,
      imageUrl: result.secure_url,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

module.exports = router;
