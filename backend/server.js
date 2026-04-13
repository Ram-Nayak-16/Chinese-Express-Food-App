const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Load environment variables from .env
dotenv.config();

// Initialize Database Connection
connectDB();

const app = express();

// Request parsing middleware
app.use(express.json());

// Configure CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

// Setup Route Endpoints
app.use('/api/users', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes);

// Serve Frontend build in production mode
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendDist));
  
  app.get('*all', (req, res) => {
    res.sendFile(path.resolve(frontendDist, 'index.html'));
  });
} else {
  // Default route in development
  app.get('/', (req, res) => {
    res.send('API is running (Development Mode)...');
  });
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
