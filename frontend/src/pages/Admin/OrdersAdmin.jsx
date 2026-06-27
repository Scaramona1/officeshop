import { useState, useEffect } from 'react';
import api from '../../services/api';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert('Ошибка');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Заказы</h2>
      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead>
          <tr><th>ID</th><th>Сумма</th><th>Адрес</th><th>Статус</th><th>Действие</th></tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.total}</td>
              <td>{order.address}</td>
              <td>{order.status}</td>
              <td>
                <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}>
                  <option value="new">Новый</option>
                  <option value="processing">В обработке</option>
                  <option value="shipped">Отправлен</option>
                  <option value="delivered">Доставлен</option>
                  <option value="cancelled">Отменён</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersAdmin;