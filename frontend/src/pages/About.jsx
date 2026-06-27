import { useState, useEffect } from 'react';
import api from '../services/api';

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get('/about');
        setAbout(res.data);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (!about) return <div>Информация не найдена</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', whiteSpace: 'pre-wrap' }}>
      <h1>{about.title}</h1>
      <div>{about.content}</div>
    </div>
  );
};

export default About;