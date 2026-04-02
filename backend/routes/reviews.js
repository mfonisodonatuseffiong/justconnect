const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const reviewsController = require("../controllers/reviewsController");

// Add a review (protected)
router.post("/", authenticateToken, reviewsController.addReview);

// Get all reviews (public or protected depending on your design)
router.get("/", reviewsController.getAllReviews);

module.exports = router;
