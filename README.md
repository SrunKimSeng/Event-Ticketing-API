# Event Ticketing API

A REST API for an event ticketing system built with Node.js, Express, MongoDB, and JWT authentication.

## Installation

1. Clone the repository
   git clone https://github.com/yourusername/event-ticketing-api.git
   cd event-ticketing-api

2. Install dependencies
   npm install

## Setup

1. Create a .env file in the root directory
2. Add the environment variables listed below

## Environment Variables

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

## Running Locally

npm run dev

## Deployed API

https://your-project-name.onrender.com

## Endpoints

### Auth
POST /api/auth/register - Register a new user
POST /api/auth/login    - Login and receive a JWT token

### Events
GET    /api/events          - Get all events
GET    /api/events?category= - Filter by category
GET    /api/events?date=     - Filter by date (YYYY-MM-DD)
GET    /api/events/:id       - Get event by ID
POST   /api/events           - Create event (admin only)
PUT    /api/events/:id       - Update event (admin only)
DELETE /api/events/:id       - Delete event (admin only)

### Bookings
GET  /api/bookings     - Get my bookings (auth required)
GET  /api/bookings/:id - Get booking by ID (auth required)
POST /api/bookings     - Create a booking (auth required)