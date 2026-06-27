import { useState, useEffect } from 'react';
import api from '../../services/api';

const PromotionsAdmin = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', image: '', startDate: '', endDate: '', isActive: true });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchPromotions = async () => {
    try {
      const res = await api.get('/promotions');
      setPromotions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/promotions/${editingId}`, form);
        setMessage('Акция обновлена');
      } else {
        await api.post('/promotions', form);
        setMessage('Акция добавлена');
      }
      setForm({ title: '', description: '', image: '', startDate: '', endDate: '', isActive: true });
      setEditingId(null);
      fetchPromotions();
    } catch (err) {
      setMessage('Ошибка');
    }
  };

  const handleEdit = (promo) => {
    setForm({
      title: promo.title,
      description: promo.description || '',
      image: promo.image || '',
      startDate: promo.startDate ? promo.startDate.split('T')[0] : '',
      endDate: promo.endDate ? promo.endDate.split('T')[0] : '',
      isActive: promo.isActive !== undefined ? promo.isActive : true
    });
    setEditingId(promo._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить акцию?')) return;
    try {
      await api.delete(`/promotions/${id}`);
      fetchPromotions();
      setMessage('Удалено');
    } catch (err) {
      setMessage('Ошибка удаления');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Управление акциями</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px' }}>
        <input name="title" placeholder="Название акции" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Описание" value={form.description} onChange={handleChange} rows="3" />
        <input name="image" placeholder="Изображение (имя файла)" value={form.image} onChange={handleChange} />
        <label>Дата начала: <input type="date" name="startDate" value={form.startDate} onChange={handleChange} /></label>
        <label>Дата окончания: <input type="date" name="endDate" value={form.endDate} onChange={handleChange} /></label>
        <label>
          Активна: <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
        </label>
        <button type="submit">{editingId ? 'Обновить' : 'Добавить'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', description: '', image: '', startDate: '', endDate: '', isActive: true }); }}>Отмена</button>}
      </form>
      {message && <p>{message}</p>}
      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead><tr><th>Название</th><th>Активна</th><th>Действия</th></tr></thead>
        <tbody>
          {promotions.map(promo => (
            <tr key={promo._id}>
              <td>{promo.title}</td>
              <td>{promo.isActive ? '✅' : '❌'}</td>
              <td>
                <button onClick={() => handleEdit(promo)}>✏️</button>
                <button onClick={() => handleDelete(promo._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PromotionsAdmin;