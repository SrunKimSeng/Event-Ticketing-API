const Event = require("../models/Event");
const Booking = require("../models/Booking");

// GET /api/admin/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const events = await Event.find();

    const dashboard = await Promise.all(
      events.map(async (event) => {
        const bookings = await Booking.find({ event: event._id })
          .populate("user", "name email");
        return {
          event: {
            _id: event._id,
            title: event.title,
            date: event.date,
            venue: event.venue,
            seatCapacity: event.seatCapacity,
            bookedSeats: event.bookedSeats,
            price: event.price,
          },
          totalBookings: bookings.length,
          totalRevenue: bookings.reduce((sum, b) => sum + b.quantity * event.price, 0),
          bookedBy: bookings.map((b) => ({
            name: b.user.name,
            email: b.user.email,
            quantity: b.quantity,
            bookingDate: b.bookingDate,
          })),
        };
      })
    );

    res.json(dashboard);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };