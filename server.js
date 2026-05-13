const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <h1>Event Ticketing API</h1>
    <p>Welcome!!!!!</p>
    <p>This is a simple API for managing events and bookings.</p>
  `);
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  const acceptsHTML = req.accepts("html");
  if (acceptsHTML) {
    res.status(404).send("<h1>404 - Page Not Found</h1>");
  } else {
    res.status(404).json({ error: "404 Not Found" });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));