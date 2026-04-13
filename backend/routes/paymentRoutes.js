const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getOrderById } = require('../controllers/paymentController');

// Routes for order creation, verification, and retrieval
router.post('/order', createOrder);
router.post('/verify', verifyPayment);
router.get('/order/:id', getOrderById);

module.exports = router;
