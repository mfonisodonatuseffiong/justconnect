// controllers/uploadController.js
const cloudinary = require("../config/cloudinary");
const { getUserById, updateUserProfilePic } = require("../models/User");

/**
 * Upload a profile picture to Cloudinary and save the URL in the database.
 * @route POST /api/v1/upload/profile
 * @access Protected (requires authenticateToken middleware)
 */
const uploadProfilePicture = async (req, res) => {
  try {
    // Check if a file is provided
    if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const file = req.files.file;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "justconnect/profiles", // organized folder in Cloudinary
      public_id: `user_${req.user.id}_${Date.now()}`, // unique name to avoid conflicts
      overwrite: true,
      transformation: [{ width: 500, height: 500, crop: "limit" }], // optional resizing
    });

    // Update the user's profile_pic in the database
    await updateUserProfilePic(req.user.id, result.secure_url);

    // Fetch updated user info
    const updatedUser = await getUserById(req.user.id);

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      url: result.secure_url,
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Upload profile picture error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { uploadProfilePicture };
