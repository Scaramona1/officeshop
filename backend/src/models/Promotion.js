import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: true }
});

export default mongoose.model('Promotion', promotionSchema);