const Booking = require("../models/Booking");
const Event = require("../models/Event");

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

    // Update bookedSeats
    event.bookedSeats += quantity;
    await event.save();

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyBookings, getBookingById, createBooking };