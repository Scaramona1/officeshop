import { useState, useEffect } from 'react';
import api from '../../services/api';

const ReviewsAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      // получаем все отзывы, включая неодобренные
      const res = await api.get('/reviews?all=true'); // если не добавили, можно просто /reviews, но там только approved. Сделаем отдельный эндпоинт для админа.
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Для простоты будем использовать тот же get, но в контроллере изменим, чтобы при наличии админа выдавались все.
  // Можно добавить параметр all=true.
  // Но проще сделать отдельный маршрут /admin/reviews, но мы уже используем /reviews.
  // В контроллере getReviews проверим, если пользователь админ, то возвращаем все, иначе только approved.
  // Обновим контроллер getReviews:

  const handleApprove = async (id) => {
    try {
      await api.put(`/reviews/${id}`, { isApproved: true });
      fetchAllReviews();
    } catch (err) {
      alert('Ошибка');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      fetchAllReviews();
    } catch (err) {
      alert('Ошибка');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Модерация отзывов</h2>
      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead><tr><th>Автор</th><th>Оценка</th><th>Текст</th><th>Одобрен</th><th>Действия</th></tr></thead>
        <tbody>
          {reviews.map(rev => (
            <tr key={rev._id}>
              <td>{rev.author}</td>
              <td>{rev.rating}</td>
              <td>{rev.text}</td>
              <td>{rev.isApproved ? '✅' : '❌'}</td>
              <td>
                {!rev.isApproved && <button onClick={() => handleApprove(rev._id)}>Одобрить</button>}
                <button onClick={() => handleDelete(rev._id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsAdmin;