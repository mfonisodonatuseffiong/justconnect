const express = require("express");
const router = express.Router();
const { uploadProfilePicture } = require("../controllers/uploadController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const fileUpload = require("express-fileupload");

// Middleware to handle file uploads
router.use(fileUpload({ useTempFiles: true }));

// Upload profile picture route
router.post("/profile", authenticateToken, uploadProfilePicture);

module.exports = router;
