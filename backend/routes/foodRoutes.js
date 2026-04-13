const express = require('express');
const {
  getFoods,
  getFoodById,
  deleteFood,
  createFood,
  updateFood,
} = require('../controllers/foodController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getFoods).post(protect, admin, createFood);
router
  .route('/:id')
  .get(getFoodById)
  .delete(protect, admin, deleteFood)
  .put(protect, admin, updateFood);

module.exports = router;
