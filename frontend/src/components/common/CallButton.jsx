import { useState, useEffect } from 'react';
import api from '../../services/api';

const CallButton = () => {
  const [phone, setPhone] = useState('+7 (495) 010-00-10');

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const res = await api.get('/contact');
        if (res.data?.phone) setPhone(res.data.phone);
      } catch (error) {
        console.error('Не удалось загрузить номер телефона');
      }
    };
    fetchPhone();
  }, []);

  return (
    <a
      href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
      style={{
        display: 'inline-block',
        padding: '8px 16px',
        background: '#28a745',
        color: '#fff',
        borderRadius: '4px',
        textDecoration: 'none',
        fontWeight: 'bold'
      }}
    >
      📞 Позвонить
    </a>
  );
};

export default CallButton;