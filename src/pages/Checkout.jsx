import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    notes: '',
    payment_method: 'bank_transfer',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (cartItems.length === 0) {
      alert("Keranjang kosong!");
      navigate('/catalog');
      return;
    }

    const payload = {
      ...formData,
      items: cartItems.map(item => ({
        product_variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.price
      })),
      grand_total: cartSubtotal,
      source: 'online',
      payment_method: formData.payment_method,
      amount_paid: cartSubtotal,
      amount_change: 0,
    };

    try {
      const response = await api.post('/order', payload);
      if (response.data.success) {
        clearCart(); // Kosongkan keranjang setelah berhasil
        navigate('/order-success', { 
                state: { 
                    order: response.data.data, // Berisi order_number, total, dll
                    paymentInstructions: response.data.payment_instructions // Instruksi dari backend
                } 
            });
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Gagal memproses pesanan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Detail Tagihan */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Invoice Details</h2>
          <div className="space-y-4">
            <input type="text" name="name" placeholder="Full Name *" onChange={handleInputChange} className="w-full border p-3 rounded" required />
            <textarea name="address" placeholder="Address *" onChange={handleInputChange} className="w-full border p-3 rounded" rows="3" required></textarea>
            <input type="tel" name="phone" placeholder="Phone Number *" onChange={handleInputChange} className="w-full border p-3 rounded" required />
            <textarea name="notes" placeholder="Notes (opsional)" onChange={handleInputChange} className="w-full border p-3 rounded" rows="2"></textarea>
          </div>
        </div>

        {/* Pesanan Anda */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Order</h2>
          
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {cartItems.map(item => (
              <div key={item.variant_id} className="flex justify-between text-sm">
                <span>{item.product_name} ({item.variant_name}) x {item.quantity}</span>
                <span className="font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-3">
            <span>Total</span>
            <span className="text-pink-600">Rp {cartSubtotal.toLocaleString('id-ID')}</span>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 rounded-lg mt-6 hover:bg-gray-900 font-semibold transition disabled:bg-gray-400"
          >
            {loading ? 'Memproses...' : 'Buat Pesanan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;