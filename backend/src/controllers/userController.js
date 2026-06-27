import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Регистрация
export const register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }
    const user = new User({ email, password, name, phone, addresses: [] });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, email, name, phone, addresses: user.addresses } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Вход
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email, name: user.name, phone: user.phone, addresses: user.addresses } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получение профиля (требуется авторизация)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Обновление профиля
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();
    res.json({ id: user._id, email: user.email, name: user.name, phone: user.phone, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Добавление адреса
export const addAddress = async (req, res) => {
  try {
    const { street, city, zip } = req.body;
    if (!street || !city) {
      return res.status(400).json({ message: 'Улица и город обязательны' });
    }
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    user.addresses.push({ street, city, zip });
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Удаление адреса
export const removeAddress = async (req, res) => {
  try {
    const { id } = req.params; // id адреса
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== id);
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};