import mongoose from 'mongoose';

// Получение отзывов: если пользователь админ – все, иначе только одобренные
export const getReviews = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const isAdmin = req.user && req.user.isAdmin; // приходит из middleware
    const filter = isAdmin ? {} : { isApproved: true };
    const reviews = await db.collection('reviews').find(filter).toArray();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Создание отзыва (публичный)
export const createReview = async (req, res) => {
  try {
    const { author, rating, text, productId } = req.body;
    if (!author || !rating || !text) {
      return res.status(400).json({ message: 'Заполните все поля' });
    }
    const db = mongoose.connection.db;
    const newReview = {
      author,
      rating: Number(rating),
      text,
      product: productId || null,
      isApproved: false, // по умолчанию на модерации
      createdAt: new Date()
    };
    const result = await db.collection('reviews').insertOne(newReview);
    res.status(201).json({ ...newReview, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Обновление отзыва (только админ) – например, одобрение
export const updateReview = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    const { isApproved } = req.body;
    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ message: 'isApproved должен быть boolean' });
    }
    const result = await db.collection('reviews').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { isApproved } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }
    const updated = await db.collection('reviews').findOne({ _id: new mongoose.Types.ObjectId(id) });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Удаление отзыва (только админ)
export const deleteReview = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    const result = await db.collection('reviews').deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }
    res.json({ message: 'Отзыв удалён' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};