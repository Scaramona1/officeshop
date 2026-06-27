import { useState, useEffect } from 'react';
import api from '../../services/api';

const ContactsAdmin = () => {
  const [contact, setContact] = useState({ address: '', phone: '', email: '', workHours: '', mapLink: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const res = await api.get('/contact');
      setContact(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/contact', contact);
      setMessage('Контакты обновлены');
    } catch (err) {
      setMessage('Ошибка');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Редактирование контактов</h2>
      <form onSubmit={handleSubmit}>
        <input name="address" placeholder="Адрес" value={contact.address} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
        <input name="phone" placeholder="Телефон" value={contact.phone} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
        <input name="email" placeholder="Email" value={contact.email} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
        <input name="workHours" placeholder="Часы работы" value={contact.workHours} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
        <input name="mapLink" placeholder="Ссылка на карту" value={contact.mapLink} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
        <button type="submit">Сохранить</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ContactsAdmin;