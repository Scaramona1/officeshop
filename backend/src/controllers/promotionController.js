import mongoose from 'mongoose';

// Получение всех акций (публичный)
export const getPromotions = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const promotions = await db.collection('promotions').find({}).toArray();
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Создание акции (только админ)
export const createPromotion = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { title, description, image, startDate, endDate, isActive } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Название акции обязательно' });
    }
    const newPromotion = {
      title,
      description: description || '',
      image: image || '',
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: new Date()
    };
    const result = await db.collection('promotions').insertOne(newPromotion);
    res.status(201).json({ ...newPromotion, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Обновление акции (только админ)
export const updatePromotion = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    const { title, description, image, startDate, endDate, isActive } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const result = await db.collection('promotions').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Акция не найдена' });
    }
    const updated = await db.collection('promotions').findOne({ _id: new mongoose.Types.ObjectId(id) });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Удаление акции (только админ)
export const deletePromotion = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    const result = await db.collection('promotions').deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Акция не найдена' });
    }
    res.json({ message: 'Акция удалена' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};