const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/", authenticateToken, bookingController.createNewBooking);
router.get("/", authenticateToken, bookingController.getAll);
router.get("/user/:userId", authenticateToken, bookingController.getUserBookings);
router.get("/pro/:professionalId", authenticateToken, bookingController.getProfessionalBookings);
router.put("/:id/status", authenticateToken, bookingController.updateStatus);
router.delete("/:id", authenticateToken, bookingController.deleteBookingRecord);

module.exports = router;
