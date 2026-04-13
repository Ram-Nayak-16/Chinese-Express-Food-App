const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('./models/Food');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const foods = [
  {
    name: 'Classic Cheeseburger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop',
    description: 'A juicy beef patty with melted cheddar, lettuce, tomato, and our secret sauce on a toasted brioche bun.',
    category: 'Burgers',
    price: 12.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Margherita Pizza',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2070&auto=format&fit=crop',
    description: 'Fresh mozzarella, san marzano tomatoes, fresh basil, and extra virgin olive oil.',
    category: 'Pizza',
    price: 15.50,
    countInStock: 7,
    rating: 4.8,
    numReviews: 8,
  },
  {
    name: 'Spicy Ramen',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=2080&auto=format&fit=crop',
    description: 'Rich tonkotsu broth, spicy miso, chashu pork, soft-boiled egg, and green onions.',
    category: 'Asian',
    price: 14.00,
    countInStock: 5,
    rating: 4.3,
    numReviews: 15,
  },
  {
    name: 'Caesar Salad',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=2070&auto=format&fit=crop',
    description: 'Crisp romaine lettuce, garlic croutons, parmesan cheese, and our house-made creamy caesar dressing.',
    category: 'Salads',
    price: 9.99,
    countInStock: 20,
    rating: 4.2,
    numReviews: 20,
  },
  {
    name: 'Sushi Platter',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop',
    description: 'Fresh assortment of nigiri and rolls including salmon, tuna, and california rolls.',
    category: 'Asian',
    price: 24.99,
    countInStock: 15,
    rating: 4.9,
    numReviews: 32,
  },
  {
    name: 'Veggie Burger',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=2090&auto=format&fit=crop',
    description: 'Plant-based patty with avocado, sprouts, tomato, and vegan mayo on a whole wheat bun.',
    category: 'Burgers',
    price: 13.50,
    countInStock: 8,
    rating: 4.6,
    numReviews: 18,
  },
  {
    name: 'Pepperoni Feast Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=2000&auto=format&fit=crop',
    description: 'Loaded with double pepperoni and extra mozzarella cheese on a hand-tossed crust.',
    category: 'Pizza',
    price: 18.00,
    countInStock: 12,
    rating: 4.7,
    numReviews: 25,
  },
  {
    name: 'Pad Thai',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=2000&auto=format&fit=crop',
    description: 'Stir-fried rice noodles with shrimp, egg, peanuts, bean sprouts, and lime.',
    category: 'Asian',
    price: 15.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 40,
  },
  {
    name: 'Greek Salad',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2000&auto=format&fit=crop',
    description: 'Fresh cucumbers, tomatoes, red onions, kalamata olives, and feta cheese with vinaigrette.',
    category: 'Salads',
    price: 11.50,
    countInStock: 25,
    rating: 4.4,
    numReviews: 14,
  },
  {
    name: 'Chocolate Lava Cake',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=2000&auto=format&fit=crop',
    description: 'Warm chocolate cake with a gooey center, served with vanilla bean ice cream.',
    category: 'Desserts',
    price: 8.99,
    countInStock: 30,
    rating: 4.9,
    numReviews: 55,
  },
  {
    name: 'Tacos al Pastor',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=2000&auto=format&fit=crop',
    description: 'Three authentic corn tortillas with marinated pork, pineapple, cilantro, and onions.',
    category: 'Mexican',
    price: 12.00,
    countInStock: 20,
    rating: 4.8,
    numReviews: 28,
  },
  {
    name: 'Chicken Tikka Masala',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2000&auto=format&fit=crop',
    description: 'Tender chicken pieces simmered in a rich, creamy, and mildly spiced tomato sauce.',
    category: 'Indian',
    price: 16.50,
    countInStock: 15,
    rating: 4.7,
    numReviews: 42,
  },
  {
    name: 'Grilled Salmon',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2000&auto=format&fit=crop',
    description: 'Fresh Atlantic salmon fillet served with roasted asparagus and garlic butter.',
    category: 'Seafood',
    price: 22.00,
    countInStock: 10,
    rating: 4.6,
    numReviews: 19,
  },
  {
    name: 'Pancakes with Syrup',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=2000&auto=format&fit=crop',
    description: 'Fluffy buttermilk pancakes topped with butter and 100% pure maple syrup.',
    category: 'Breakfast',
    price: 10.50,
    countInStock: 18,
    rating: 4.5,
    numReviews: 22,
  },
  {
    name: 'Fruit Smoothie',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2000&auto=format&fit=crop',
    description: 'Refreshing blend of strawberry, banana, mango, and freshly squeezed orange juice.',
    category: 'Drinks',
    price: 6.99,
    countInStock: 40,
    rating: 4.3,
    numReviews: 31,
  }
];

const importData = async () => {
  try {
    await Food.deleteMany();
    await User.deleteMany();

    const createdUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      isAdmin: true,
    });

    const sampleFoods = foods.map((food) => {
      return { ...food, user: createdUser._id };
    });

    await Food.insertMany(sampleFoods);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
