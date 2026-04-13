const mongoose = require('mongoose');

// Connect to MongoDB database
const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // If no database URI is found in env variables, start a local in-memory DB
    if (!uri) {
      console.log('No MONGODB_URI found. Starting local in-memory database...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Automatically seed initial food menu items if collection is empty
    const Food = require('../models/Food');
    const count = await Food.countDocuments();
    if (count === 0) {
      console.log('Seeding initial food items...');
      const User = require('../models/User');

      // Create a default administrator user
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password123',
        isAdmin: true,
        isVerified: true
      });

      // Standard list of Chinese Express dishes
      const foods = [
        { name: 'Classic Cheeseburger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop', description: 'Juicy beef patty with melted cheddar.', category: 'Burgers', price: 250, countInStock: 10, rating: 4.5, numReviews: 12, user: admin._id },
        { name: 'Spicy Ramen', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=2080&auto=format&fit=crop', description: 'Rich tonkotsu broth & spicy miso.', category: 'Asian', price: 350, countInStock: 5, rating: 4.3, numReviews: 15, user: admin._id },
        { name: 'Sushi Platter', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop', description: 'Fresh nigiri and rolls assortment.', category: 'Asian', price: 600, countInStock: 15, rating: 4.9, numReviews: 32, user: admin._id },
        { name: 'Caesar Salad', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=2070&auto=format&fit=crop', description: 'Crisp romaine with parmesan.', category: 'Salads', price: 200, countInStock: 12, rating: 4.2, numReviews: 20, user: admin._id },
        { name: 'Paneer Butter Masala', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2000', description: 'Rich and creamy paneer curry.', category: 'Indian', price: 350, countInStock: 20, rating: 4.8, numReviews: 45, user: admin._id },
        { name: 'Veg Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=2000', description: 'Aromatic basmati rice cooked with mixed vegetables.', category: 'Indian', price: 280, countInStock: 15, rating: 4.7, numReviews: 30, user: admin._id },
        { name: 'Chicken Tikka', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=2000', description: 'Spicy and tender roasted chicken chunks.', category: 'Indian', price: 380, countInStock: 25, rating: 4.9, numReviews: 50, user: admin._id },
        { name: 'Hakka Noodles', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=2000', description: 'Stir-fried noodles with assorted vegetables.', category: 'Chinese', price: 250, countInStock: 15, rating: 4.3, numReviews: 28, user: admin._id },
        { name: 'Fried Rice', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=2000', description: 'Classic Chinese style stir-fried rice.', category: 'Chinese', price: 220, countInStock: 25, rating: 4.1, numReviews: 22, user: admin._id },
        { name: 'Chocolate Brownie', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=2000', description: 'Warm and gooey fudge brownie.', category: 'Dessert', price: 180, countInStock: 50, rating: 4.9, numReviews: 80, user: admin._id },
        { name: 'Chicken Dumplings', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=2000', description: 'Steamed chicken dumplings with spicy dip.', category: 'Asian', price: 150, countInStock: 25, rating: 4.8, numReviews: 40, user: admin._id },
        { name: 'Tandoori Chicken', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=2000', description: 'Roasted chicken marinated in yogurt and spices.', category: 'Indian', price: 350, countInStock: 20, rating: 4.9, numReviews: 60, user: admin._id },
        { name: 'Dal Makhani', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2000', description: 'Classic black lentils slow-cooked with butter and cream.', category: 'Indian', price: 220, countInStock: 20, rating: 4.7, numReviews: 35, user: admin._id },
        { name: 'Mango Lassi', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=2000', description: 'Sweet yogurt drink with fresh mango pulp.', category: 'Beverages', price: 100, countInStock: 40, rating: 4.8, numReviews: 50, user: admin._id },
        { name: 'Kung Pao Chicken', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=2000', description: 'Spicy stir-fried Chinese dish with chicken and peanuts.', category: 'Chinese', price: 320, countInStock: 20, rating: 4.8, numReviews: 42, user: admin._id },
        { name: 'Chilli Paneer', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=2000', description: 'Crispy paneer tossed in spicy Indo-Chinese sauces.', category: 'Chinese', price: 280, countInStock: 15, rating: 4.7, numReviews: 38, user: admin._id },
        { name: 'Hot & Sour Soup', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2000', description: 'Classic Asian thick soup with spicy and tangy broth.', category: 'Chinese', price: 130, countInStock: 25, rating: 4.5, numReviews: 24, user: admin._id }
      ];

      await Food.insertMany(foods);
      console.log('Seeding completed!');
    }
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
