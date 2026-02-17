import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; 

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    page: 1,
    limit: 10 
  });
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  const API_URL = 'http://127.0.0.1:8000';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/products', { params: filters });
      
      setProducts(response.data.data.data);
      setPagination({
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        total: response.data.data.total
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo(0, 0); 
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 🛠️ Filter & Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            name="search"
            placeholder="Cari produk impianmu..." 
            value={filters.search}
            onChange={handleFilterChange}
            className="flex-grow border border-gray-200 rounded-full px-5 py-3 focus:ring-2 focus:ring-pink-200 outline-none"
          />
          <select 
            name="category_id"
            value={filters.category_id}
            onChange={handleFilterChange}
            className="border border-gray-200 rounded-full px-5 py-3 bg-white focus:ring-2 focus:ring-pink-200 outline-none"
          >
            <option value="">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.category_name}</option>
            ))}
          </select>
        </div>

        {/* 🛠️ Grid Produk */}
        {loading ? (
          <div className="text-center py-10">Memuat produk...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="relative pb-[100%]">
                  <img 
                    src={`${API_URL}${product.main_image}`} 
                    alt={product.product_name}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                    {product.product_name}
                  </h3>
                  <p className="text-gray-500 text-xs mb-3 flex-grow">
                    {product.description?.substring(0, 50)}...
                  </p>
                  
                  <Link to={`/products/${product.id}`} className="w-full bg-pink-50 text-pink-600 font-semibold py-2 rounded-full hover:bg-pink-100 transition-colors text-sm text-center">Product Variants</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🛠️ Pagination (Minimalis) */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button 
            disabled={pagination.current_page === 1}
            onClick={() => handlePageChange(pagination.current_page - 1)}
            className="px-5 py-2 border rounded-full bg-white hover:bg-gray-100 disabled:opacity-50 text-sm font-semibold"
          >
            Prev
          </button>
          
          <span className="text-sm text-gray-600">
            Halaman {pagination.current_page} dari {pagination.last_page}
          </span>
          
          <button 
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => handlePageChange(pagination.current_page + 1)}
            className="px-5 py-2 border rounded-full bg-white hover:bg-gray-100 disabled:opacity-50 text-sm font-semibold"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCatalog;