import { useState, useEffect } from 'react';
import api from '../../services/api';

const CategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        setMessage('Категория обновлена');
      } else {
        await api.post('/categories', form);
        setMessage('Категория добавлена');
      }
      setForm({ name: '', slug: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setMessage('Ошибка');
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug });
    setEditingId(cat._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить категорию?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      setMessage('Удалено');
    } catch (err) {
      setMessage('Ошибка удаления');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Управление категориями</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input name="name" placeholder="Название" value={form.name} onChange={handleChange} required />
        <input name="slug" placeholder="Slug (например, muzhskaya-odezhda)" value={form.slug} onChange={handleChange} />
        <button type="submit">{editingId ? 'Обновить' : 'Добавить'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', slug: '' }); }}>Отмена</button>}
      </form>
      {message && <p>{message}</p>}
      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead><tr><th>Название</th><th>Slug</th><th>Действия</th></tr></thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat._id}>
              <td>{cat.name}</td>
              <td>{cat.slug}</td>
              <td>
                <button onClick={() => handleEdit(cat)}>✏️</button>
                <button onClick={() => handleDelete(cat._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesAdmin;