import { useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    size: '',
    minPrice: '',
    maxPrice: '',
    paperFormat: '',
    color: '',
    search: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '', brand: '', size: '', minPrice: '', maxPrice: '',
      paperFormat: '', color: '', search: ''
    });
  };

  if (loading) return <div className="container">Загрузка товаров...</div>;

  return (
    <div className="container">
      <h1>Каталог</h1>

      {/* Фильтры */}
      <div className="filters">
        <input type="text" name="search" placeholder="Поиск" value={filters.search} onChange={handleFilterChange} />
        <input type="text" name="brand" placeholder="Бренд" value={filters.brand} onChange={handleFilterChange} />
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">Все категории</option>
          <option value="Бумага">Бумага</option>
          <option value="Письменные принадлежности">Письменные принадлежности</option>
          <option value="Оргтехника">Оргтехника</option>
          <option value="Расходные материалы">Расходные материалы</option>
          <option value="Папки и файлы">Папки и файлы</option>
          <option value="Подарочные наборы">Подарочные наборы</option>
          <option value="Карандаши">Карандаши</option>
          <option value="Ручки">Ручки</option>
          <option value="Органайзеры">Органайзеры</option>
        </select>
        <select name="paperFormat" value={filters.paperFormat} onChange={handleFilterChange}>
          <option value="">Все форматы</option>
          <option value="A4">A4</option>
          <option value="A3">A3</option>
          <option value="A5">A5</option>
        </select>
        <select name="color" value={filters.color} onChange={handleFilterChange}>
          <option value="">Все цвета</option>
          <option value="Синий">Синий</option>
          <option value="Черный">Черный</option>
          <option value="Красный">Красный</option>
          <option value="Разные">Разные</option>
        </select>
        <input type="number" name="minPrice" placeholder="Цена от" value={filters.minPrice} onChange={handleFilterChange} />
        <input type="number" name="maxPrice" placeholder="Цена до" value={filters.maxPrice} onChange={handleFilterChange} />
        <button onClick={clearFilters}>Сбросить</button>
      </div>

      {/* Список товаров */}
      {products.length === 0 ? (
        <p>Товаров не найдено</p>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <img
                src={`/images/${product.images?.[0] || 'placeholder.jpg'}`}
                alt={product.name}
                onError={(e) => e.target.src = '/images/placeholder.jpg'}
              />
              <h3>{product.name}</h3>
              <div className="price">{product.price} ₽</div>
              {product.paperFormat && <div className="specs">Формат: {product.paperFormat}</div>}
              {product.color && <div className="specs">Цвет: {product.color}</div>}
              {product.density && <div className="specs">Плотность: {product.density} г/м²</div>}
              {product.quantityPerPack && <div className="specs">В упаковке: {product.quantityPerPack} шт.</div>}
              <button className="add-to-cart" onClick={() => addToCart(product)}>
                В корзину
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;