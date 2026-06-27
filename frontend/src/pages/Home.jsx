import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Добро пожаловать в канцелярский магазин!</h1>
      <p style={{ fontSize: '1.2rem' }}>
        Всё для офиса, школы и творчества. Бумага, ручки, органайзеры, техника и многое другое.
      </p>
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        <Link to="/catalog" style={{ padding: '12px 24px', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
          Перейти в каталог
        </Link>
        <Link to="/promotions" style={{ padding: '12px 24px', background: '#28a745', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
          Акции
        </Link>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Наши преимущества</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>✅ Широкий ассортимент канцтоваров</li>
          <li>✅ Выгодные цены и скидки</li>
          <li>✅ Быстрая доставка по Москве</li>
          <li>✅ Экспертная поддержка</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;