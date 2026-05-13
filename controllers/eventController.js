const Event = require("../models/Event");

// GET /api/events
const getEvents = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.date) {
      const start = new Date(req.query.date);
      const end = new Date(req.query.date);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }
    const events = await Event.find(filter);
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// GET /api/events/:id
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    next(error);
  }
};

// POST /api/events (admin only)
const createEvent = async (req, res, next) => {
  try {
    const { title, description, category, venue, date, time, seatCapacity, price } = req.body;

    if (!title || !date || !seatCapacity || price === undefined) {
      return res.status(400).json({ error: "Please provide title, date, seatCapacity, and price" });
    }
    if (seatCapacity < 1) return res.status(400).json({ error: "seatCapacity must be greater than 0" });
    if (price < 0) return res.status(400).json({ error: "price must not be negative" });

    const event = await Event.create({ title, description, category, venue, date, time, seatCapacity, price });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

// PUT /api/events/:id (admin only)
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Prevent seatCapacity from going below bookedSeats
    if (req.body.seatCapacity !== undefined && req.body.seatCapacity < event.bookedSeats) {
      return res.status(400).json({ error: "seatCapacity cannot be less than bookedSeats" });
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/events/:id (admin only)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const Booking = require("../models/Booking");
    const bookings = await Booking.countDocuments({ event: req.params.id });
    if (bookings > 0) {
      return res.status(400).json({ error: "Cannot delete event with existing bookings" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };