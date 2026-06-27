// backend/src/controllers/categoryController.js
import mongoose from 'mongoose';

export const getCategories = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const categories = await db.collection('categories').find({}).toArray();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { name, slug } = req.body;
    if (!name) return res.status(400).json({ message: 'Название обязательно' });
    const newCategory = { name, slug: slug || name.toLowerCase().replace(/ /g, '-') };
    const result = await db.collection('categories').insertOne(newCategory);
    res.status(201).json({ ...newCategory, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    const { name, slug } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    const result = await db.collection('categories').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Категория не найдена' });
    const updated = await db.collection('categories').findOne({ _id: new mongoose.Types.ObjectId(id) });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    const result = await db.collection('categories').deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Категория не найдена' });
    res.json({ message: 'Категория удалена' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};