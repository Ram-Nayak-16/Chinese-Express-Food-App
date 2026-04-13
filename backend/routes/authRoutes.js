const express = require('express');
const {
  registerUser,
  authUser,
  getUserProfile,
  getUsers,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Auth routes (beginner-friendly namespace)
router.post('/signup', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

// Legacy routes (backward compatibility support)
router.post('/', registerUser); // legacy signup
router.get('/', protect, admin, getUsers);

module.exports = router;
