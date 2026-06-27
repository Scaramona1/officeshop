import mongoose from 'mongoose';

// Получение контактов (публично)
export const getContact = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    let contact = await db.collection('contacts').findOne({});
    if (!contact) {
      // Если нет записи, создаём пустую (чтобы не было 404)
      const newContact = { address: '', phone: '', email: '', workHours: '', mapLink: '' };
      const result = await db.collection('contacts').insertOne(newContact);
      contact = { ...newContact, _id: result.insertedId };
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Обновление контактов (только админ)
export const updateContact = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { address, phone, email, workHours, mapLink } = req.body;
    const updateData = {};
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (workHours !== undefined) updateData.workHours = workHours;
    if (mapLink !== undefined) updateData.mapLink = mapLink;

    // Находим существующую запись
    const existing = await db.collection('contacts').findOne({});
    if (existing) {
      await db.collection('contacts').updateOne({ _id: existing._id }, { $set: updateData });
    } else {
      // Если записи нет, создаём новую с переданными данными
      await db.collection('contacts').insertOne(updateData);
    }
    const updated = await db.collection('contacts').findOne({});
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};