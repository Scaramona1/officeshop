import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  address: String,
  phone: String,         // номер для кнопки "Позвонить"
  email: String,
  workHours: String,
  mapLink: String
});

// синглтон – одна запись
export default mongoose.model('Contact', contactSchema);