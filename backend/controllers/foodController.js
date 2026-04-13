const Food = require('../models/Food');

// @desc    Fetch all food items (supports keyword search)
// @route   GET /api/food
const getFoods = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    
    // Create an empty query filter
    let query = {};
    
    // If the user entered a search query, filter by food name (case-insensitive)
    if (keyword) {
      query = {
        name: {
          $regex: keyword,
          $options: 'i'
        }
      };
    }

    // Find all matching foods from the database
    const foods = await Food.find(query);
    
    // Send response back containing foods array
    res.json({ 
      foods: foods, 
      page: 1, 
      pages: 1 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch a single food item by ID
// @route   GET /api/food/:id
const getFoodById = async (req, res) => {
  try {
    const id = req.params.id;
    const food = await Food.findById(id);

    // If the food item is found, return it, else return 404 error
    if (food) {
      res.json(food);
    } else {
      res.status(404).json({ message: 'Food not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a food item (Admin only)
// @route   DELETE /api/food/:id
const deleteFood = async (req, res) => {
  try {
    const id = req.params.id;
    const food = await Food.findById(id);

    // If the food item exists, delete it
    if (food) {
      await Food.deleteOne({ _id: food._id });
      res.json({ message: 'Food removed successfully' });
    } else {
      res.status(404).json({ message: 'Food not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a sample food item (Admin only)
// @route   POST /api/food
const createFood = async (req, res) => {
  try {
    // Create new food document with default sample values
    const food = new Food({
      name: 'Sample Name',
      price: 0,
      user: req.user._id,
      image: '/images/sample.jpg',
      category: 'Sample Category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample Description',
    });

    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a food item details (Admin only)
// @route   PUT /api/food/:id
const updateFood = async (req, res) => {
  try {
    const id = req.params.id;
    const food = await Food.findById(id);

    // If the food exists, update its properties from req.body fields
    if (food) {
      food.name = req.body.name;
      food.price = req.body.price;
      food.description = req.body.description;
      food.image = req.body.image;
      food.category = req.body.category;
      food.countInStock = req.body.countInStock;

      const updatedFood = await food.save();
      res.json(updatedFood);
    } else {
      res.status(404).json({ message: 'Food not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFoods,
  getFoodById,
  deleteFood,
  createFood,
  updateFood,
};
