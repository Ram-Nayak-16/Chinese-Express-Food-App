const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes & verify user authentication
const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  // Check if token exists and is a Bearer token
  if (token && token.startsWith('Bearer')) {
    try {
      // Extract token string
      token = token.split(' ')[1];
      
      // Verify JWT token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user in database and exclude password hash from the result
      req.user = await User.findById(decoded.id).select('-password');

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If token is missing
  return res.status(401).json({ message: 'Not authorized, no token' });
};

// Middleware to restrict access to Admin users only
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(401).json({ message: 'Not authorized as an admin' });
};

module.exports = { protect, admin };
