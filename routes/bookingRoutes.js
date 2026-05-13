const express = require("express");
const router = express.Router();
const { getMyBookings, getBookingById, createBooking } = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.post("/", protect, createBooking);

module.exports = router;