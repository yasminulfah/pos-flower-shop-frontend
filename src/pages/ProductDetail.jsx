import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext'; 

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart(); 

  const API_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = (variant) => {
    const cartItem = {
      product_id: product.id,
      product_name: product.product_name,
      variant_id: variant.id,
      variant_name: variant.variant_name,
      price: parseFloat(variant.price),
      image: variant.detail_image || product.main_image, 
      quantity: 1, 
    };

    addToCart(cartItem);
    alert(`${product.product_name} (${variant.variant_name}) berhasil ditambahkan!`);
  };

  if (loading) return <div className="text-center py-10">Memuat produk...</div>;
  if (!product) return <div className="text-center py-10">Produk tidak ditemukan.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          
          {/* Bagian Produk Utama */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="rounded-xl overflow-hidden bg-gray-100">
              <img src={`${API_URL}${product.main_image}`} alt={product.product_name} className="w-full h-full object-cover"/>
            </div>
            <div>
              <span className="text-sm text-pink-600 font-semibold">{product.category?.category_name}</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{product.product_name}</h2>
              <p className="text-gray-600 text-lg mb-6">{product.description}</p>
            </div>
          </div>

          {/* Bagian Varian - Tombol Langsung di Sini */}
          <div className="border-t pt-8">
            <h3 className="text-2xl font-bold mb-6">Pilih Varian</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.variants?.map(variant => (
                <div key={variant.id} className="border-2 border-gray-200 rounded-xl p-4 flex flex-col transition-all hover:border-pink-200 hover:shadow-sm">
                  {variant.detail_image && (
                    <img src={`${API_URL}${variant.detail_image}`} alt={variant.variant_name} className="w-full h-48 object-cover rounded-lg mb-4"/>
                  )}
                  <h4 className="text-lg font-semibold mb-1">{variant.variant_name}</h4>
                  <p className="text-2xl font-bold text-pink-600 mb-2">Rp {Number(variant.price).toLocaleString('id-ID')}</p>
                  <p className="text-sm text-gray-500 mb-4">Stok: {variant.stock}</p>
                  
                  {/* 3. Tombol Add to Cart langsung di dalam kartu varian */}
                  <button 
                    onClick={() => handleAddToCart(variant)}
                    disabled={variant.stock <= 0}
                    className={`mt-auto w-full py-3 rounded-lg font-semibold text-sm transition-colors ${
                      variant.stock > 0 
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {variant.stock > 0 ? 'Add to Cart' : 'Stok Habis'}
                  </button>
                </div>
              ))}
            </div>
            
            {/* 4. Tombol aksi bawah dihapus */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;