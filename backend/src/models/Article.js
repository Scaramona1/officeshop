import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Article', articleSchema);