import mongoose from 'mongoose';

export const createOrder = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { items, total, address, phone, email } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Корзина пуста' });
    }
    if (!address) {
      return res.status(400).json({ message: 'Укажите адрес доставки' });
    }

    // Если пользователь авторизован, берём его _id из req.user (устанавливается в middleware)
    const userId = req.user?._id || null;

    const order = {
      user: userId,
      items: items.map(item => ({
        product: new mongoose.Types.ObjectId(item._id),
        quantity: item.quantity,
        price: item.price
      })),
      total,
      address,
      phone: phone || '',
      email: email || '',
      status: 'new', // new, processing, shipped, delivered, cancelled
      createdAt: new Date()
    };

    const result = await db.collection('orders').insertOne(order);
    res.status(201).json({ ...order, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Не авторизован' });
    }
    const orders = await db.collection('orders').find({ user: userId }).toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Для администратора – просмотр всех заказов (можно сделать позже)
export const getAllOrders = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const orders = await db.collection('orders').find({}).toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Обновление статуса заказа (для администратора)
export const updateOrderStatus = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    const { status } = req.body;
    await db.collection('orders').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { status } }
    );
    res.json({ message: 'Статус обновлён' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};