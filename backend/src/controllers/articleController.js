// backend/src/controllers/articleController.js
import mongoose from 'mongoose';

export const getArticles = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const articles = await db.collection('articles').find({}).toArray();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { title, content, image } = req.body;
    if (!title) return res.status(400).json({ message: 'Заголовок обязателен' });
    const newArticle = { title, content: content || '', image: image || '', createdAt: new Date() };
    const result = await db.collection('articles').insertOne(newArticle);
    res.status(201).json({ ...newArticle, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    const { title, content, image } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (image !== undefined) updateData.image = image;
    const result = await db.collection('articles').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Статья не найдена' });
    const updated = await db.collection('articles').findOne({ _id: new mongoose.Types.ObjectId(id) });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    const result = await db.collection('articles').deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Статья не найдена' });
    res.json({ message: 'Статья удалена' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};