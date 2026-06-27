import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import CallButton from './components/common/CallButton';

// Импорт всех страниц
import Home from './pages/Home';
import About from './pages/About';
import Contacts from './pages/Contacts';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Articles from './pages/Articles';
import Promotions from './pages/Promotions';
import Reviews from './pages/Reviews';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Импорт админских компонентов
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import ProductsAdmin from './pages/Admin/ProductsAdmin';
import CategoriesAdmin from './pages/Admin/CategoriesAdmin';
import OrdersAdmin from './pages/Admin/OrdersAdmin';
import ArticlesAdmin from './pages/Admin/ArticlesAdmin';
import PromotionsAdmin from './pages/Admin/PromotionsAdmin';
import ReviewsAdmin from './pages/Admin/ReviewsAdmin';
import ContactsAdmin from './pages/Admin/ContactsAdmin';

function App() {
  const { user, logout } = useAuth();

  return (
    <BrowserRouter>
      {/* Навигация */}
      <nav style={{
        padding: '10px 20px',
        background: '#f8f9fa',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '10px'
      }}>
        {/* Левый блок со ссылками */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <Link to="/">Главная</Link>
          <Link to="/about">О нас</Link>
          <Link to="/contacts">Контакты</Link>
          <Link to="/catalog">Каталог</Link>
          <Link to="/cart">Корзина</Link>
          <Link to="/articles">Статьи</Link>
          <Link to="/promotions">Акции</Link>
          <Link to="/reviews">Отзывы</Link>

          {user ? (
            <>
              <Link to="/profile">Профиль</Link>
              <Link to="/admin">Админка</Link>
              <button
                onClick={logout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: 0
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Вход</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </div>

        {/* Кнопка "Позвонить" прижата вправо */}
        <div style={{ marginLeft: 'auto' }}>
          <CallButton />
        </div>
      </nav>

      {/* Основной контент */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* Админские маршруты */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="categories" element={<CategoriesAdmin />} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="articles" element={<ArticlesAdmin />} />
            <Route path="promotions" element={<PromotionsAdmin />} />
            <Route path="reviews" element={<ReviewsAdmin />} />
            <Route path="contacts" element={<ContactsAdmin />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;