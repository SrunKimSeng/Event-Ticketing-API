const express = require("express");
const router = express.Router();
const { getMyBookings, getBookingById, createBooking, validateBooking } = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");

router.get("/validate/:qr", validateBooking);
router.get("/", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.post("/", protect, createBooking);

module.exports = router;