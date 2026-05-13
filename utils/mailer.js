const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingConfirmation = async (to, name, eventTitle, quantity, bookingId) => {
  await transporter.sendMail({
    from: `"Event Ticketing" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Booking Confirmation - ${eventTitle}`,
    html: `
      <h2>Booking Confirmed!</h2>
      <p>Hi ${name},</p>
      <p>Your booking for <strong>${eventTitle}</strong> is confirmed.</p>
      <p>Quantity: ${quantity}</p>
      <p>Booking ID: ${bookingId}</p>
      <p>Thank you!</p>
    `,
  });
};

module.exports = { sendBookingConfirmation };