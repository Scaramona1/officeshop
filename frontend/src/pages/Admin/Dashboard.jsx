import { useState, useEffect } from 'react';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, reviews: 0, articles: 0, promotions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, orders, reviews, articles, promotions] = await Promise.all([
          api.get('/products'),
          api.get('/orders'),
          api.get('/reviews'),
          api.get('/articles'),
          api.get('/promotions')
        ]);
        setStats({
          products: products.data.length,
          orders: orders.data.length,
          reviews: reviews.data.length,
          articles: articles.data.length,
          promotions: promotions.data.length
        });
      } catch (err) {
        console.error('Ошибка загрузки статистики:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Загрузка статистики...</div>;

  return (
    <div>
      <h2>Статистика</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Товары</h3>
          <p style={{ fontSize: '24px' }}>{stats.products}</p>
        </div>
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Заказы</h3>
          <p style={{ fontSize: '24px' }}>{stats.orders}</p>
        </div>
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Отзывы</h3>
          <p style={{ fontSize: '24px' }}>{stats.reviews}</p>
        </div>
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Статьи</h3>
          <p style={{ fontSize: '24px' }}>{stats.articles}</p>
        </div>
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Акции</h3>
          <p style={{ fontSize: '24px' }}>{stats.promotions}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;