import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import ShippingSelector from '../components/ShippingSelector';
import PackagingSelector from '../components/PackagingSelector';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [selectedPackaging, setSelectedPackaging] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");
  const [shippings, setShippings] = useState([]);
  const [packagings, setPackagings] = useState([]);

  const [formData, setFormData] = useState({
    customer_name: '', 
    shipping_address: '', 
    greeting_card_note: '',
    delivery_at: '',
    payment_method: '',
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const shippingRes = await api.get("/shippings");
        const packagingRes = await api.get("/packagings");

        setShippings(shippingRes.data.data);
        setPackagings(packagingRes.data.data);

      } catch (error) {
        console.error("Failed to fetch options", error);
      }
    };

    fetchOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      setLoading(false);
      navigate('/catalog');
      return;
    }

    const payload = {
      customer_name: formData.customer_name, 
      shipping_address: formData.shipping_address, 
      shipping_id: selectedShipping,
      package_id: selectedPackaging,
      delivery_at: formData.delivery_at,
      greeting_card_note: formData.greeting_card_note,
      
      items: cartItems.map(item => ({
        product_variant_id: item.variant_id,
        quantity: item.quantity,
      })),
      
      grand_total: cartSubtotal,
      
      source: 'online', 
      
      payment_method: formData.payment_method,
      amount_paid: 0, 
      amount_change: 0,
    };

    try {
      const response = await api.post('/order', payload);
      
      if (response.data.success) {
        clearCart(); // Kosongkan keranjang setelah berhasil
        navigate('/order-success', { 
            state: { 
                order: response.data.data, 
            } 
        });
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Order failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Detail Tagihan */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Details</h2>
          <div className="space-y-4">
            {/* Customer Name */}
            <input
              type="text"
              name="customer_name"
              placeholder="Customer Name *"
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
              required
            />
            {/* Delivery Address */}
            <textarea
              name="shipping_address"
              placeholder="Delivery Address *"
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
              rows="3"
              required
            />
            {/* Delivery Date */}
            <input
              type="datetime-local"
              name="delivery_at"
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
              required
            />
            {/* Shipping */}
            <ShippingSelector
              shippings={shippings}
              selectedShipping={selectedShipping}
              setSelectedShipping={setSelectedShipping}
            />

            {/* Packaging */}
            <PackagingSelector
              packagings={packagings}
              selectedPackaging={selectedPackaging}
              setSelectedPackaging={setSelectedPackaging}
            />
            {/* Greeting Card */}
            <textarea
              name="greeting_card_note"
              placeholder="Greeting Card Message (optional)"
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
              rows="2"
            />

            {/* Payment Method */}
            <select
              name="payment_method"
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="cash">Cash</option>
              <option value="transfer">Bank Transfer</option>
              <option value="ewallet">E-Wallet</option>
            </select>
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
            className="w-full bg-pink-600 text-white py-3 rounded-lg mt-6 hover:bg-gray-900 font-semibold transition disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Make order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;