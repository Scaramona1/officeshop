import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const addProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    // Очищаем коллекцию товаров (чтобы не было дублей)
    await db.collection('products').deleteMany({});

    // Массив товаров – здесь вы указываете свои данные
    const products = [
      {
        name: "Карандаш простой",
        description: "Твердость HB, с ластиком, 12 шт в упаковке",
        price: 150,
        brand: "Faber-Castell",
        category: "Карандаши",
        images: ["pencil.jpg"],      // замените на имя вашего файла
        stock: 100,
        quantityPerPack: 12
      },
      {
        name: "Ручка шариковая синяя",
        description: "Корпус прозрачный, 0.7 мм, 20 шт в упаковке",
        price: 200,
        brand: "Pilot",
        category: "Ручки",
        images: ["pen-blue.jpg"],    // замените на имя вашего файла
        stock: 150,
        color: "Синий",
        quantityPerPack: 20
      },
      {
        name: "Органайзер для канцелярии",
        description: "5 отделений, пластик, цвет чёрный",
        price: 450,
        brand: "OfficePro",
        category: "Органайзеры",
        images: ["organizer.jpg"],   // замените на имя вашего файла
        stock: 30
      },
      {
        name: "Цветные карандаши",
        description: "Набор из 12 цветов, в деревянной коробке",
        price: 350,
        brand: "Koh-i-Noor",
        category: "Карандаши",
        images: ["color-pencils.jpg"], // замените на имя вашего файла
        stock: 50,
        quantityPerPack: 12
      }
    ];

    // Вставляем товары в базу
    for (const p of products) {
      await db.collection('products').insertOne(p);
    }

    console.log('✅ Товары добавлены!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Ошибка:', err);
    process.exit(1);
  }
};

addProducts();