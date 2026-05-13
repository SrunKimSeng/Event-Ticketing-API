const Booking = require("../models/Booking");
const Event = require("../models/Event");
const QRCode = require("qrcode");

// GET /api/bookings — logged in user's bookings only
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event", "title date time venue price");
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings/:id — single booking (must belong to user)
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("event", "title date time venue price");

    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to view this booking" });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// POST /api/bookings — create a booking
const createBooking = async (req, res, next) => {
  try {
    const { eventId, quantity } = req.body;

    if (!eventId || !quantity) {
      return res.status(400).json({ error: "Please provide eventId and quantity" });
    }
    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const availableSeats = event.seatCapacity - event.bookedSeats;
    if (quantity > availableSeats) {
      return res.status(400).json({ error: `Only ${availableSeats} seats available` });
    }

    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      quantity,
    });

    // Generate QR code
    const qrData = JSON.stringify({ bookingId: booking._id, userId: req.user._id, eventId });
    const qrCode = await QRCode.toDataURL(qrData);
    booking.qrCode = qrCode;
    await booking.save();

    // Update bookedSeats
    event.bookedSeats += quantity;
    await event.save();

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings/validate/:bookingId
const validateBooking = async (req, res, next) => {
  try {
    console.log("Validating:", req.params.qr);
    const booking = await Booking.findById(req.params.qr)
      .populate("event", "title date time venue")
      .populate("user", "name email");

    if (!booking) return res.status(404).json({ error: "Invalid booking" });

    res.json({ 
      valid: true, 
      booking: {
        _id: booking._id,
        user: booking.user,
        event: booking.event,
        quantity: booking.quantity,
        bookingDate: booking.bookingDate,
      }
    });
  } catch (error) {
    console.error("Validate error:", error.message);
    next(error);
  }
};

module.exports = { getMyBookings, getBookingById, createBooking, validateBooking };