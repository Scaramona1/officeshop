import mongoose from 'mongoose';

// Получение списка товаров с фильтрацией
export const getProducts = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { category, size, brand, minPrice, maxPrice, search } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (size) filter.size = { $in: size.split(',') };
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const products = await db.collection('products').find(filter).toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получение одного товара по ID
export const getProductById = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const product = await db.collection('products').findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ message: 'Товар не найден' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Создание товара (только для админа)
export const createProduct = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { name, description, price, size, brand, category, images, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Название и цена обязательны' });
    }

    const newProduct = {
      name,
      description: description || '',
      price: Number(price),
      size: size || [],
      brand: brand || '',
      category: category || '',
      images: images || [],
      stock: stock || 0,
      createdAt: new Date()
    };

    const result = await db.collection('products').insertOne(newProduct);
    res.status(201).json({ ...newProduct, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Обновление товара (только для админа)
export const updateProduct = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    const { name, description, price, size, brand, category, images, stock } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (size !== undefined) updateData.size = size;
    if (brand !== undefined) updateData.brand = brand;
    if (category !== undefined) updateData.category = category;
    if (images !== undefined) updateData.images = images;
    if (stock !== undefined) updateData.stock = Number(stock);

    const result = await db.collection('products').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    const updated = await db.collection('products').findOne({ _id: new mongoose.Types.ObjectId(id) });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Удаление товара (только для админа)
export const deleteProduct = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;

    const result = await db.collection('products').deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    res.json({ message: 'Товар удалён' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};