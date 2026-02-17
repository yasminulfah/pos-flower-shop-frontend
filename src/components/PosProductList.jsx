import { useState } from 'react';

const PosProductList = ({ products, addToCart, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = 'http://127.0.0.1:8000';

  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-4">Memuat produk...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Daftar Produk</h2>
        {/* Input Pencarian Cepat */}
        <input
          type="text"
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-64 text-sm"
        />
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto max-h-[60vh] p-1">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="border rounded-lg p-3 hover:border-pink-300 transition-colors bg-gray-50 flex flex-col">
              <img
                src={`${API_URL}${product.main_image}`}
                alt={product.product_name}
                className="w-full h-24 object-cover rounded-md mb-2"
              />
              <h3 className="font-semibold text-sm text-gray-800 truncate mb-2" title={product.product_name}>
                {product.product_name}
              </h3>
              
              {/* Daftar Varian */}
              <div className="space-y-2 mt-auto">
                {product.variants && product.variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => addToCart(product, variant)}
                    disabled={variant.stock <= 0}
                    className={`w-full text-left p-2 rounded-md text-xs border transition-all ${
                      variant.stock > 0 
                      ? 'bg-white hover:bg-pink-50 border-gray-200 hover:border-pink-200' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-medium truncate">{variant.variant_name}</div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="font-bold text-pink-700">Rp {Number(variant.price).toLocaleString('id-ID')}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs ${variant.stock > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            Stok: {variant.stock}
                        </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-6 text-gray-500">
            Produk tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
};

export default PosProductList;