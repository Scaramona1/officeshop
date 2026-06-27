import { useState, useEffect } from 'react';
import api from '../services/api';

const Contacts = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await api.get('/contact');
        setContact(res.data);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (!contact) return <div>Контакты не найдены</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Контакты</h1>
      <p><strong>Адрес:</strong> {contact.address}</p>
      <p><strong>Телефон:</strong> {contact.phone}</p>
      <p><strong>Email:</strong> <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
      <p><strong>Время работы:</strong> {contact.workHours}</p>
      <div style={{ marginTop: '20px' }}>
        <h3>Мы на карте</h3>
        <a href={contact.mapLink || 'https://yandex.ru/maps/'} target="_blank" rel="noopener noreferrer">Открыть карту</a>
      </div>
    </div>
  );
};

export default Contacts;