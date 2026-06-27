import { useCart } from '../context/CartContext';
import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleOrder = async () => {
    if (!address) {
      alert('Укажите адрес доставки');
      return;
    }
    if (cart.length === 0) {
      alert('Корзина пуста');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          _id: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        total: getTotalPrice(),
        address,
        phone,
        email: email || user?.email || ''
      };
      await api.post('/orders', orderData);
      clearCart();
      setMessage('Заказ оформлен! Спасибо за покупку.');
    } catch (error) {
      console.error('Ошибка оформления:', error);
      setMessage('Ошибка оформления заказа. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <div style={{ padding: '20px' }}><h1>Корзина пуста</h1></div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Корзина</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cart.map(item => (
          <li key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #ddd', padding: '10px 0' }}>
            <img src={`/images/${item.images?.[0] || 'placeholder.jpg'}`} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <h3>{item.name}</h3>
              <p>{item.price} ₽</p>
            </div>
            <div>
              <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
              <span style={{ margin: '0 10px' }}>{item.quantity}</span>
              <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
            </div>
            <button onClick={() => removeFromCart(item._id)}>Удалить</button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '20px', fontSize: '20px' }}>
        <strong>Итого: {getTotalPrice()} ₽</strong>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Данные для доставки</h3>
        <input
          type="text"
          placeholder="Адрес доставки *"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          required
        />
        <input
          type="tel"
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button onClick={handleOrder} disabled={loading} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>
          {loading ? 'Оформление...' : 'Оформить заказ'}
        </button>
        {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      </div>
    </div>
  );
};

export default Cart;