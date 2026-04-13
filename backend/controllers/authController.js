const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to sign a JWT token
const generateToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
const registerUser = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // Check if the user already exists in the database
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user (password is automatically hashed by User.js pre-save hook)
    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });

    // Automatically log the user in by returning their details with a JWT token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log in an existing user
// @route   POST /api/auth/login
const authUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Find the user by their email address
    const user = await User.findOne({ email: email });

    // Step 1: Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Step 2: Compare user input password with the hashed password in database
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Step 3: If correct, return user details along with JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile details
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    // req.user is set by the protect middleware after verifying JWT
    const id = req.user._id;
    const user = await User.findById(id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users list (Admin only)
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, authUser, getUserProfile, getUsers };
