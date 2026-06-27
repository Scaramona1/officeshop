import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number
  }],
  total: Number,
  status: { type: String, enum: ['new', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'new' },
  address: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);