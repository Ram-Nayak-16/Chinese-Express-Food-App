const Review = require('../models/Review');

// @desc    Add a new customer review
// @route   POST /api/reviews
const addReview = async (req, res) => {
  try {
    const { name, rating, comment, userId } = req.body;

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Create the review document in the database
    const review = await Review.create({
      name,
      rating,
      comment,
      user: userId || null,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get latest reviews (limit to last 10)
// @route   GET /api/reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
      
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getReviews };
