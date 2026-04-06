const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  qty:      { type: Number, required: true, min: 1 },
  price:    { type: Number, required: true },
  itemId:   { type: String },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: () => `ORD-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurant: {
    id:   { type: String, required: true },
    name: { type: String, required: true },
  },
  items:    [orderItemSchema],
  subtotal: { type: Number, required: true },
  delivery: { type: Number, default: 49 },
  taxes:    { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total:    { type: Number, required: true },
  status: {
    type: String,
    enum: ['placed','confirmed','preparing','pickup','delivered','cancelled'],
    default: 'placed',
  },
  deliveryAddress: {
    street:  String,
    city:    String,
    pincode: String,
  },
  rider: {
    name:  String,
    phone: String,
  },
  estimatedDelivery: { type: Number, default: 30 }, // minutes
}, { timestamps: true });

// Index for fast lookup by orderId and user
orderSchema.index({ orderId: 1 });
orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
