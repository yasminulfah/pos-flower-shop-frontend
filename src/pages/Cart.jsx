import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  
  // Ganti dengan URL API Produksi Anda
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-10 text-center min-h-[50vh] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Keranjang Belanja</h1>
        <p className="text-gray-500 mb-6">Keranjang Anda masih kosong.</p>
        <Link to="/catalog" className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.variant_id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
              <img 
                src={`${API_URL}${item.image}`}
                alt={item.product_name} 
                className="w-20 h-20 object-cover rounded-md" 
              />
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-800">{item.product_name}</h3>
                <p className="text-sm text-gray-500">Variant: {item.variant_name}</p>
                <p className="text-pink-600 font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.variant_id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                <span className="font-semibold w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.variant_id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
              </div>
              <button onClick={() => removeFromCart(item.variant_id)} className="text-red-500 hover:text-red-700 text-sm ml-4">
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Ringkasan */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Summary</h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-800">Rp {cartSubtotal.toLocaleString('id-ID')}</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between mb-6">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg text-pink-600">Rp {cartSubtotal.toLocaleString('id-ID')}</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 font-semibold transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;