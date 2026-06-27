import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user } = useAuth();
  if (!user?.isAdmin) {
    return <div style={{ padding: '20px' }}>Доступ запрещён. Только для администраторов.</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{ width: '220px', background: '#343a40', color: '#fff', padding: '20px' }}>
        <h3>Админ-панель</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Главная</Link></li>
          <li><Link to="/admin/products" style={{ color: '#fff', textDecoration: 'none' }}>Товары</Link></li>
          <li><Link to="/admin/categories" style={{ color: '#fff', textDecoration: 'none' }}>Категории</Link></li>
          <li><Link to="/admin/orders" style={{ color: '#fff', textDecoration: 'none' }}>Заказы</Link></li>
          <li><Link to="/admin/articles" style={{ color: '#fff', textDecoration: 'none' }}>Статьи</Link></li>
          <li><Link to="/admin/promotions" style={{ color: '#fff', textDecoration: 'none' }}>Акции</Link></li>
          <li><Link to="/admin/reviews" style={{ color: '#fff', textDecoration: 'none' }}>Отзывы</Link></li>
          <li><Link to="/admin/contacts" style={{ color: '#fff', textDecoration: 'none' }}>Контакты</Link></li>
        </ul>
      </nav>
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;