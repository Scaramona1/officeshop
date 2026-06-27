import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  phone: String,
  addresses: [{
    street: String,
    city: String,
    zip: String
  }],
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Хеширование пароля перед сохранением (используем обычную функцию)
userSchema.pre('save', function(next) {
  // Если пароль не изменился, пропускаем
  if (!this.isModified('password')) {
    return next();
  }
  // Хешируем с солью 10
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

// Метод для сравнения паролей (асинхронный)
userSchema.methods.comparePassword = async function(candidate) {
  return await bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);