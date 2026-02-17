import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/my-orders');
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mx-6">Riwayat Pesanan Saya</h1>
      
      {orders.length === 0 ? (
        <p>Belum ada pesanan.</p>
      ) : (
        <div className="space-y-4 pt-5 px-6">
          {orders.map(order => (
            <Link to={`/my-orders/${order.id}`} key={order.id} className="block">
            <div key={order.id} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex justify-between">
                <span className="font-bold text-pink-600">#{order.order_number}</span>
                <span className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
              <p>Total: Rp {Number(order.grand_total).toLocaleString('id-ID')}</p>
              <p className="text-sm font-semibold text-gray-700">Status: {order.status}</p>
            </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;