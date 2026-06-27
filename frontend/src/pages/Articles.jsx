import { useState, useEffect } from 'react';
import api from '../services/api';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles');
        setArticles(res.data);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return <div>Загрузка статей...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Полезные статьи</h1>
      {articles.length === 0 && <p>Статей пока нет</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {articles.map((article) => (
          <li key={article._id} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <h3>{article.title}</h3>
            <p>{article.content ? article.content.substring(0, 150) + '...' : ''}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Articles;