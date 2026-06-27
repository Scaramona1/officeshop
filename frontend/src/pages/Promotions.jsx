import { useState, useEffect } from 'react';
import api from '../services/api';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await api.get('/promotions');
        setPromotions(res.data);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setPromotions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  if (loading) return <div>Загрузка акций...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Акции</h1>
      {promotions.length === 0 && <p>Акций пока нет</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {promotions.map((promo) => (
          <li key={promo._id} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <h3>{promo.title}</h3>
            <p>{promo.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Promotions;