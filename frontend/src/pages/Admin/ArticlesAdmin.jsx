import { useState, useEffect } from 'react';
import api from '../../services/api';

const ArticlesAdmin = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', content: '', image: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchArticles = async () => {
    try {
      const res = await api.get('/articles');
      setArticles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/articles/${editingId}`, form);
        setMessage('Статья обновлена');
      } else {
        await api.post('/articles', form);
        setMessage('Статья добавлена');
      }
      setForm({ title: '', content: '', image: '' });
      setEditingId(null);
      fetchArticles();
    } catch (err) {
      setMessage('Ошибка');
    }
  };

  const handleEdit = (art) => {
    setForm({ title: art.title, content: art.content || '', image: art.image || '' });
    setEditingId(art._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить статью?')) return;
    try {
      await api.delete(`/articles/${id}`);
      fetchArticles();
      setMessage('Удалено');
    } catch (err) {
      setMessage('Ошибка удаления');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Управление статьями</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px' }}>
        <input name="title" placeholder="Заголовок" value={form.title} onChange={handleChange} required />
        <textarea name="content" placeholder="Содержание" value={form.content} onChange={handleChange} rows="4" />
        <input name="image" placeholder="Ссылка на изображение (имя файла)" value={form.image} onChange={handleChange} />
        <button type="submit">{editingId ? 'Обновить' : 'Добавить'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', content: '', image: '' }); }}>Отмена</button>}
      </form>
      {message && <p>{message}</p>}
      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead><tr><th>Заголовок</th><th>Действия</th></tr></thead>
        <tbody>
          {articles.map(art => (
            <tr key={art._id}>
              <td>{art.title}</td>
              <td>
                <button onClick={() => handleEdit(art)}>✏️</button>
                <button onClick={() => handleDelete(art._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticlesAdmin;