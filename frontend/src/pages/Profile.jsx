import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [newAddress, setNewAddress] = useState({ street: '', city: '', zip: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
    if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my');
      setOrders(res.data);
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err);
    }
  };

  const fetchAddresses = () => {
    setAddresses(user?.addresses || []);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/me', { name, phone });
      setMessage('Данные обновлены');
      // можно обновить контекст, но для простоты оставим
    } catch (err) {
      setMessage('Ошибка обновления');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/me/addresses', newAddress);
      setAddresses(res.data);
      setNewAddress({ street: '', city: '', zip: '' });
      setMessage('Адрес добавлен');
    } catch (err) {
      setMessage('Ошибка добавления адреса');
    }
  };

  const handleRemoveAddress = async (addressId) => {
    try {
      await api.delete(`/users/me/addresses/${addressId}`);
      setAddresses(addresses.filter(addr => addr._id !== addressId));
      setMessage('Адрес удалён');
    } catch (err) {
      setMessage('Ошибка удаления');
    }
  };

  if (!user) {
    return <div style={{ padding: '20px' }}>Пожалуйста, войдите в систему.</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Личный кабинет</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('profile')} style={{ padding: '8px 16px', background: activeTab === 'profile' ? '#007bff' : '#eee', color: activeTab === 'profile' ? '#fff' : '#000', border: 'none', borderRadius: '4px' }}>Мои данные</button>
        <button onClick={() => setActiveTab('addresses')} style={{ padding: '8px 16px', background: activeTab === 'addresses' ? '#007bff' : '#eee', color: activeTab === 'addresses' ? '#fff' : '#000', border: 'none', borderRadius: '4px' }}>Адреса</button>
        <button onClick={() => setActiveTab('orders')} style={{ padding: '8px 16px', background: activeTab === 'orders' ? '#007bff' : '#eee', color: activeTab === 'orders' ? '#fff' : '#000', border: 'none', borderRadius: '4px' }}>Заказы</button>
        <button onClick={logout} style={{ padding: '8px 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}>Выйти</button>
      </div>

      {message && <p>{message}</p>}

      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile}>
          <div style={{ marginBottom: '10px' }}>
            <label>Имя</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Телефон</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '8px' }} />
          </div>
          <button type="submit" disabled={loading} style={{ padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>Сохранить</button>
        </form>
      )}

      {activeTab === 'addresses' && (
        <div>
          <h3>Добавить адрес</h3>
          <form onSubmit={handleAddAddress}>
            <input type="text" placeholder="Улица" value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} required />
            <input type="text" placeholder="Город" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} required />
            <input type="text" placeholder="Индекс" value={newAddress.zip} onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
            <button type="submit" style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>Добавить</button>
          </form>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
            {addresses.map(addr => (
              <li key={addr._id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span>{addr.street}, {addr.city} {addr.zip}</span>
                <button onClick={() => handleRemoveAddress(addr._id)} style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px' }}>Удалить</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h3>История заказов</h3>
          {orders.length === 0 ? <p>У вас пока нет заказов.</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {orders.map(order => (
                <li key={order._id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                  <div><strong>Заказ №{order._id}</strong> – сумма: {order.total} ₽</div>
                  <div>Статус: {order.status}</div>
                  <div>Адрес: {order.address}</div>
                  <div>Дата: {new Date(order.createdAt).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;