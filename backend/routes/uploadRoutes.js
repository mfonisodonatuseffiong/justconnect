const express = require("express");
const router = express.Router();
const { uploadFile } = require("../controllers/uploadController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const fileUpload = require("express-fileupload");

// Middleware to handle file uploads
router.use(fileUpload({ useTempFiles: true }));

// Upload route
router.post("/", authenticateToken, uploadFile);

module.exports = router;
