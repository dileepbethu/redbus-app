import express from 'express';
import jwt from 'jsonwebtoken';
import { Booking } from '../models/booking.js';
import dotenv from 'dotenv';


const router = express.Router();

// Authentication middleware directly in the route file
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedData?.userId;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Apply authentication to all booking routes
router.use(authenticate);

// POST /api/bookings
router.post("/", async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      user: req.userId  // Add the user ID from the authenticated token
    });
    await booking.save();
    res.status(201).json({ message: "Booking saved successfully!" });
  } catch (error) {
    console.error('Booking save error:', error);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

// GET /api/bookings (gets all bookings for the authenticated user)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: "Failed to get bookings" });
  }
});

export default router;