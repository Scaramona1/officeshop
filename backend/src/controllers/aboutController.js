import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

export const getAbout = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const about = await db.collection('abouts').findOne({});
    if (!about) {
      return res.status(404).json({ message: 'Текст "О нас" не найден' });
    }
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};