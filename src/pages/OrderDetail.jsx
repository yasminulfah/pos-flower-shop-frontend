import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // --- FUNGSI UTAMA: Mengambil Data Pesanan ---
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/my-orders/${id}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order', error);
      alert('Gagal mengambil detail pesanan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // --- FUNGSI: Membatalkan Pesanan ---
  const handleCancelOrder = async () => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) return;
    
    setCancelling(true);
    try {
      await api.post(`/my-orders/${id}/cancel`);
      alert('Pesanan berhasil dibatalkan.');
      fetchOrder(); // Refresh data setelah berhasil
    } catch (error) {
      console.error('Error cancelling order', error);
      alert(error.response?.data?.message || 'Gagal membatalkan pesanan.');
    } finally {
      setCancelling(false);
    }
  };

  // --- LOGIKA STATUS TRACKER ---
  const getStatusTracker = () => {
    if (!order) return null;
    const statusSteps = ['pending', 'completed'];
    const currentStatusIndex = statusSteps.indexOf(order.status);
    
    // Jika dibatalkan, tracker tidak perlu ditampilkan
    if (order.status === 'cancelled') {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-center font-semibold">
                Pesanan ini telah dibatalkan.
            </div>
        );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow border mb-6">
        <h2 className="text-lg font-semibold mb-6">Status Pesanan</h2>
        <div className="relative flex items-center justify-between">
          {statusSteps.map((step, index) => (
            <div key={step} className="flex flex-col items-center flex-1 relative z-10">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold
                ${index <= currentStatusIndex 
                  ? 'bg-pink-600 border-pink-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-500'}`}>
                {index < currentStatusIndex ? '✓' : index + 1}
              </div>
              <p className={`text-xs mt-2 uppercase font-medium ${index <= currentStatusIndex ? 'text-pink-700' : 'text-gray-500'}`}>
                {step}
              </p>
              {index < statusSteps.length - 1 && (
                <div className={`absolute h-0.5 top-5 -z-10
                  ${index < currentStatusIndex ? 'bg-pink-600' : 'bg-gray-300'}`}
                  style={{ left: 'calc(50% + 20px)', width: 'calc(100% - 40px)' }}>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- RENDER LOADING / NOT FOUND ---
  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading data pesanan...</div>;
  }

  if (!order) {
    return <div className="container mx-auto px-4 py-16 text-center">Pesanan tidak ditemukan.</div>;
  }

  // --- RENDER UI ---
  return (
    <div className="container mx-auto px-4 py-2">
      <Link to="/my-orders" className="text-pink-600 hover:underline mb-4 inline-block">
        &larr; Back to My Orders
      </Link>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detail Pesanan #{order.order_number}</h1>
        
        {/* Tombol Batalkan hanya muncul jika status 'pending' */}
        {order.status === 'pending' && (
          <button
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:bg-gray-400"
          >
            {cancelling ? 'Membatalkan...' : 'Batalkan Pesanan'}
          </button>
        )}
      </div>
      
      {/* Panggil fungsi tracker */}
      {getStatusTracker()}

      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-lg font-semibold mb-4">Order Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-gray-500">Order Date</p>
            <p className="font-semibold">{new Date(order.created_at).toLocaleString('id-ID')}</p>
          </div>
          <div>
            <p className="text-gray-500">Payment Method</p>
            <p className="font-semibold uppercase">{order.payment_method}</p>
          </div>
        </div>

        <h3 className="text-md font-semibold mb-3">Product Items</h3>
        <div className="space-y-3">
          {order.order_items.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b pb-3">
              <div className="flex gap-4 items-center">
                <img 
                  src={`http://localhost:8000/${item.product_variant.product.main_image}`} 
                  alt={item.product_variant.product.product_name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {item.product_variant.product.product_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Variant: {item.product_variant.variant_name}
                  </p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold text-gray-800">
                Rp {item.price_at_buy ? Number(item.price_at_buy).toLocaleString('id-ID') : '0'}
              </p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end mt-6 text-lg font-bold border-t pt-4">
          <p className="mr-4">Total:</p>
          <p className="text-pink-600">Rp {Number(order.grand_total).toLocaleString('id-ID')}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;