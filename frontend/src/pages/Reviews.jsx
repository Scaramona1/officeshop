import { useState, useEffect } from 'react';
import api from '../services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ author: '', rating: 5, text: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', form);
      setMessage('Спасибо! Отзыв будет опубликован после модерации.');
      setForm({ author: '', rating: 5, text: '' });
      fetchReviews();
    } catch (error) {
      setMessage('Ошибка отправки');
    }
  };

  if (loading) return <div>Загрузка отзывов...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Отзывы</h1>
      {reviews.length === 0 && <p>Пока нет отзывов. Будьте первым!</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {reviews.map((rev) => (
          <li key={rev._id} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
            <div><strong>{rev.author}</strong> (оценка: {rev.rating}/5)</div>
            <p>{rev.text}</p>
            <small>{new Date(rev.createdAt).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>

      <h2>Оставить отзыв</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input
          type="text"
          name="author"
          placeholder="Ваше имя"
          value={form.author}
          onChange={handleChange}
          required
        />
        <select name="rating" value={form.rating} onChange={handleChange} required>
          <option value="5">5 – Отлично</option>
          <option value="4">4 – Хорошо</option>
          <option value="3">3 – Средне</option>
          <option value="2">2 – Плохо</option>
          <option value="1">1 – Ужасно</option>
        </select>
        <textarea
          name="text"
          placeholder="Ваш отзыв"
          value={form.text}
          onChange={handleChange}
          rows="4"
          required
        />
        <button type="submit">Отправить</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Reviews;