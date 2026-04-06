const router = require('express').Router();
const Order  = require('../models/Order');
const auth   = require('../middleware/auth');

const STATUS_FLOW = ['placed','confirmed','preparing','pickup','delivered'];
const STATUS_DELAYS = [0, 5000, 15000, 25000, 40000]; // ms

// Simulate order status progression via Socket.io
function simulateOrderProgress(io, orderId) {
  STATUS_FLOW.forEach((status, i) => {
    setTimeout(async () => {
      try {
        await Order.findOneAndUpdate({ orderId }, { status });
        io.to(`order_${orderId}`).emit('order_update', { orderId, status });
        console.log(`[Order] ${orderId} → ${status}`);
      } catch (err) {
        console.error('[Order] Status update error:', err);
      }
    }, STATUS_DELAYS[i]);
  });
}

// POST /api/orders
router.post('/', auth, async (req, res) => {
  try {
    const { restaurant, items, subtotal, delivery, taxes, discount, deliveryAddress } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    const total = subtotal + (delivery || 0) + (taxes || 0) - (discount || 0);

    const order = await Order.create({
      user:    req.user._id,
      restaurant,
      items,
      subtotal,
      delivery: delivery || 49,
      taxes:    taxes || 0,
      discount: discount || 0,
      total,
      deliveryAddress,
      rider: { name: 'Ravi Kumar', phone: '+91 98765 43210' },
    });

    // Kick off real-time status updates
    simulateOrderProgress(req.io, order.orderId);

    res.status(201).json({
      message: 'Order placed successfully!',
      orderId: order.orderId,
      order,
    });
  } catch (err) {
    console.error('[Orders] Create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/:orderId
router.get('/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Users can only view their own orders
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied' });

    res.json({ data: order });
  } catch (err) {
    console.error('[Orders] Fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders  (user's order history)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
