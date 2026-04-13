const express = require('express');
const { addReview, getReviews } = require('../controllers/reviewController');

const router = express.Router();

router.route('/').get(getReviews).post(addReview);

module.exports = router;
