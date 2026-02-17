import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const order = location.state?.order;

  const adminWhatsApp = "62881027328915"; 

  useEffect(() => {
    if (!order) {
      navigate('/');
    } else {
      clearCart();
    }
  }, [order, navigate, clearCart]);

  if (!order) return null;

  const whatsappMessage = encodeURIComponent(
    `Halo Admin Uma Bloemist, saya ingin konfirmasi pembayaran untuk pesanan: *${order.order_number}* total *Rp ${order.grand_total.toLocaleString('id-ID')}*.`
  );

  return (
    <div className="container mx-auto px-4 text-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 max-w-2xl mx-auto">
        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Pesanan Berhasil!</h1>
        
        <div className="bg-gray-50 border rounded-lg p-4 mt-6">
          <p className="text-sm text-gray-500">Nomor Pesanan</p>
          <p className="text-xl font-bold text-pink-600">{order.order_number}</p>
        </div>

        <div className="mt-8 text-left">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Instruksi Pembayaran</h2>
          <div className="bg-white border rounded-lg p-6 shadow-inner space-y-4">
            <p className="text-gray-700">Silakan konfirmasi pesanan via WhatsApp dan lakukan pembayaran sebesar:</p>
            <p className="text-2xl font-bold text-gray-900">
              Rp {order.grand_total.toLocaleString('id-ID')}
            </p>
            
            {/* 2. Tombol Hubungi WhatsApp */}
            <a 
              href={`https://wa.me/${adminWhatsApp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a5.451 5.451 0 0 1-2.775-.754l-.199-.118-2.062.541.549-2.008-.127-.207a5.452 5.452 0 0 1-.834-2.85c0-3.003 2.443-5.448 5.45-5.448 1.455 0 2.823.567 3.85 1.595a5.448 5.448 0 0 1 1.595 3.852c.002 3.004-2.443 5.449-5.447 5.449m-5.45-12.257c-3.003 0-5.45 2.446-5.45 5.45 0 1.716.822 3.242 2.083 4.238l-1.396 5.105 5.223-1.37a5.448 5.448 0 0 0 4.54 2.235h.003c3.004 0 5.45-2.445 5.45-5.449 0-1.455-.567-2.822-1.595-3.85a5.449 5.449 0 0 0-3.852-1.595Z"/></svg>
              Konfirmasi via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;