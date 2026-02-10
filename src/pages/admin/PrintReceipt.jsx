import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';

function PrintReceipt() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/order/${id}`);
        setOrder(response.data.data);
        setLoading(false);
        // Otomatis panggil fungsi print setelah data dimuat
        setTimeout(() => {
          window.print();
        }, 500);
      } catch (error) {
        console.error("Failed to fetch order", error);
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading receipt...</div>;
  if (!order) return <div className="text-center mt-10">Order not found.</div>;

  return (
    <div className="p-4" style={{ width: '80mm' }}>
      {/* Agar ukuran receiptnya pas di kertas thermal */}
      <style>
        {`
          @media print {
            body { -webkit-print-color-adjust: exact; }
            button { display: none; }
          }
        `}
      </style>
      
      <div className="text-center mb-4">
        <h1 className="font-bold text-xl">Uma Bloemist</h1>
        <p className="text-xs">Gg. Mushola No. 58, Kebasen, Banyumas</p>
      </div>

      <div className="border-b border-dashed border-black mb-2 text-xs">
        <p>Order ID: {order.order_number}</p>
        <p>Date: {new Date(order.created_at).toLocaleString('id-ID')}</p>
        <p>Cashier: {order.user?.name || 'Admin'}</p>
        <p>Customer: {order.customer_name || 'Guest'}</p>
      </div>

      <table className="w-full text-xs mb-2">
        <thead>
          <tr>
            <th className="text-left">Item</th>
            <th className="text-center">Qty</th>
            <th className="text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.order_items.map((item, index) => {
            // Ambil harga dari price_at_buy (berdasarkan log)
            const price = Number(item.price_at_buy) || 0;
            const qty = Number(item.quantity) || 0;
            const totalItem = price * qty;

            return (
              <tr key={index}>
                <td>
                  {/* Ambil nama produk dari product_variant -> product */}
                  {item.product_variant?.product?.product_name || 'Unknown'}
                  ({item.product_variant?.variant_name || '-'})
                </td>
                <td className="text-center">{qty}</td>
                <td className="text-right">
                  {totalItem.toLocaleString('id-ID')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="border-t border-dashed border-black pt-2 text-xs font-bold">
        <div className="flex justify-between">
          <span>TOTAL</span>
          <span>Rp {(Number(order.grand_total) ?? 0).toLocaleString('id-ID')}</span>
        </div>
  
        {/* --- PASTIKAN FIELD SESUAI DENGAN BACKEND --- */}
        <div className="flex justify-between mt-1">
          <span>PAY (Cash)</span>
          <span>Rp {(Number(order.amount_paid) ?? 0).toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span>CHANGE</span>
          <span>Rp {(Number(order.amount_change) ?? 0).toLocaleString('id-ID')}</span>
        </div>
      </div>
      
      <div className="text-center mt-4 text-xs">
        <p>Thank you for your purchase!</p>
      </div>
    </div>
  );
}

export default PrintReceipt;