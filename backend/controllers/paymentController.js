const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// @desc    Create a Razorpay Order / COD Order and internal database Order
// @route   POST /api/payment/order
const createOrder = async (req, res) => {
  try {
    // Extract request body variables explicitly
    const amount = req.body.amount;
    const cartItems = req.body.cartItems;
    const billing = req.body.billing;
    const userId = req.body.userId;
    const paymentMethod = req.body.paymentMethod || 'online'; // Get payment method

    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';

    let rzpOrder = { id: 'cod_' + Date.now(), amount: amount, currency: 'INR' };

    // Only create a Razorpay transaction order if the method is 'online'
    if (paymentMethod === 'online') {
      const razorpayInstance = new Razorpay({ 
        key_id: key_id, 
        key_secret: key_secret 
      });

      const options = {
        amount: Math.round(amount * 100), 
        currency: "INR",
        receipt: "receipt_" + Date.now(),
      };

      rzpOrder = await razorpayInstance.orders.create(options);
    }

    // Map items from cart array to fit database Order schema
    const orderItemsMapped = cartItems.map((item) => {
      return {
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        id: item._id
      };
    });

    // Save pending order in database
    const order = new Order({
      user: userId,
      orderItems: orderItemsMapped,
      paymentMethod: paymentMethod,
      itemsPrice: billing.itemsPrice,
      gstPrice: billing.gstPrice,
      handlingPrice: billing.handlingPrice,
      gatewayPrice: billing.gatewayPrice,
      deliveryPrice: billing.deliveryPrice,
      discountPrice: billing.discountPrice,
      totalPrice: amount,
      isPaid: paymentMethod === 'cod' ? false : false, // Paid is false initially for both
      razorpayOrderId: rzpOrder.id
    });

    const createdOrder = await order.save();

    res.status(200).json({
      success: true,
      order: rzpOrder,
      dbOrderId: createdOrder._id,
      key_id: key_id
    });
  } catch (error) {
    console.error('Order creation error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create order. Please try again.', 
      error: error.message 
    });
  }
};

// @desc    Verify Razorpay Payment signature and mark Order as Paid
// @route   POST /api/payment/verify
const verifyPayment = async (req, res) => {
  try {
    // Extract request body variables explicitly
    const razorpay_order_id = req.body.razorpay_order_id;
    const razorpay_payment_id = req.body.razorpay_payment_id;
    const razorpay_signature = req.body.razorpay_signature;
    const dbOrderId = req.body.dbOrderId;

    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';

    // Verify signature using SHA-256 HMAC
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(text.toString())
      .digest('hex');

    // Compare signature sent by Razorpay vs what we generated
    if (expectedSignature === razorpay_signature) {
      
      // Find the corresponding order in our database
      const order = await Order.findById(dbOrderId || razorpay_order_id);
      
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: razorpay_payment_id,
          status: 'success',
          update_time: Date.now().toString(),
        };
        await order.save();
      }
      
      res.status(200).json({ 
        success: true, 
        message: 'Payment verified and Order updated successfully' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment verification failed (Invalid signature)' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying payment', 
      error: error.message 
    });
  }
};

// @desc    Get order details by ID
// @route   GET /api/payment/order/:id
const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id);

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getOrderById,
};
