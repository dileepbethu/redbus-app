import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import User from '../models/User.js';

const router = express.Router();

// Enhanced signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are sent back' 
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({  
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password strength
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol'
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ // 409 Conflict is more appropriate
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password with stronger salt
    const salt = await bcrypt.genSalt(16);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user
    const user = new User({ 
      name: validator.escape(username), // Sanitize input
      email: validator.normalizeEmail(email), // Normalize email
      password: hashedPassword
    });

    await user.save();

    // Generate JWT token with secure options
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { 
        expiresIn: '1h',
        algorithm: 'HS256' // Explicitly specify algorithm
      }
    );

    // Omit sensitive data from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    // Secure cookie settings for production
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userResponse,
      token // Also send token in response for mobile clients
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
// New refresh token endpoint
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ token: newToken });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});
// Login Endpoint (Add this new route)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
     res.cookie('token', token, {
      httpOnly: true,
      secure: false, // false for localhost, true in production
      sameSite: 'lax', // Changed from 'strict'
      maxAge: 3600000,

      path: '/', // Explicit path
    });

    // Return response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
router.get('/test-cookie', (req, res) => {
  console.log('Received cookies:', req.cookies);
  res.json({ cookies: req.cookies, headers: req.headers });
});
export default router;