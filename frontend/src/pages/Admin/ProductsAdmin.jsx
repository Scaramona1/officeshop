import { useState, useEffect } from 'react';
import api from '../../services/api';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', price: '', size: '', brand: '', category: '', images: '', stock: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage('Товар обновлён');
      } else {
        await api.post('/products', payload);
        setMessage('Товар добавлен');
      }
      setForm({ name: '', description: '', price: '', size: '', brand: '', category: '', images: '', stock: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setMessage('Ошибка');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      size: product.size ? product.size.join(', ') : '',
      brand: product.brand || '',
      category: product.category || '',
      images: product.images ? product.images.join(', ') : '',
      stock: product.stock || ''
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
      setMessage('Удалено');
    } catch (err) {
      setMessage('Ошибка удаления');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Управление товарами</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <input name="name" placeholder="Название" value={form.name} onChange={handleChange} required />
        <input name="description" placeholder="Описание" value={form.description} onChange={handleChange} />
        <input name="price" placeholder="Цена" type="number" value={form.price} onChange={handleChange} required />
        <input name="size" placeholder="Размеры (через запятую)" value={form.size} onChange={handleChange} />
        <input name="brand" placeholder="Бренд" value={form.brand} onChange={handleChange} />
        <input name="category" placeholder="Категория" value={form.category} onChange={handleChange} />
        <input name="images" placeholder="Изображения (через запятую)" value={form.images} onChange={handleChange} />
        <input name="stock" placeholder="Количество" type="number" value={form.stock} onChange={handleChange} />
        <button type="submit">{editingId ? 'Обновить' : 'Добавить'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', size: '', brand: '', category: '', images: '', stock: '' }); }}>Отмена</button>}
      </form>
      {message && <p>{message}</p>}
      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead><tr><th>Название</th><th>Цена</th><th>Бренд</th><th>Действия</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.brand}</td>
              <td>
                <button onClick={() => handleEdit(p)}>✏️</button>
                <button onClick={() => handleDelete(p._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsAdmin;