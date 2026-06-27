import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  size: [String],
  brand: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String],          // массив путей к картинкам
  stock: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);