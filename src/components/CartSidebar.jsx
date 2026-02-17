import { useState } from 'react'; // 1. Impor useState
import ShippingSelector from './ShippingSelector';
import PackagingSelector from './PackagingSelector';

function CartSidebar({
  cart,
  customerName,
  setCustomerName,
  totalPrice,
  cashPaid,
  setCashPaid,
  cashChange,
  setCashChange,
  shippings,
  selectedShipping,
  setSelectedShipping,
  packagings,
  selectedPackaging,
  setSelectedPackaging,
  handleCheckout, // <--- FUNGSI INI AKAN KITA MODIFIKASI
  updateQuantity,
  handleHoldOrder,
  pendingOrders,
  handleResumeOrder
}) {

  // 2. State untuk Metode Pembayaran di Sidebar
  const [paymentMethod, setPaymentMethod] = useState('cash');

  console.log("CartSidebar render, cart data:", cart);
  
  // Update validasi: jika bank_transfer, cashChange tidak harus >= 0, 
  // tapi harus pastikan user sudah bayar nominal tertentu (diatur di backend)
  const canCheckout = cart.length > 0;

  // 3. Fungsi modifikasi untuk mengirim data pembayaran ke parent (POS Component)
  const onCheckout = () => {
    handleCheckout(paymentMethod); // Kirim metode pembayaran ke fungsi checkout
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-6 h-fit">
      <h2 className="text-xl font-bold mb-4">New Order</h2>
      <input
        type="text"
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <div className="space-y-3 mb-4 h-60 overflow-y-auto pr-2">
        {cart.map((item) => (
          <div key={item.variant_id} className="flex justify-between items-center text-sm border-b pb-2">
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs text-gray-500">
                Rp {item.price.toLocaleString('id-ID')} x {item.quantity}
              </div>
            </div>
            <div className="flex items-center gap-1 mx-2">
              <button onClick={() => updateQuantity(item.variant_id, -1)} className="bg-gray-200 px-2 py-1 rounded text-xs">-</button>
              <span className="font-bold w-6 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.variant_id, 1)} className="bg-gray-200 px-2 py-1 rounded text-xs">+</button>
            </div>
            <span className="font-semibold w-24 text-right">
              Rp {(item.price * item.quantity).toLocaleString('id-ID')}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 mb-4">
        <ShippingSelector
          shippings={shippings}
          selectedShipping={selectedShipping}
          setSelectedShipping={setSelectedShipping}
        />
        <PackagingSelector
          packagings={packagings}
          selectedPackaging={selectedPackaging}
          setSelectedPackaging={setSelectedPackaging}
        />
      </div>

      {/* 4. Dropdown Metode Pembayaran */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Payment Method:</label>
        <select 
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="cash">Cash</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>
      </div>

      <div className="border-t pt-4 font-bold text-lg flex justify-between">
        <span>Total</span>
        <span className="text-pink-700">Rp {totalPrice.toLocaleString('id-ID')}</span>
      </div>

      {/* Tampilkan input cash hanya jika metode pembayaran adalah 'cash' */}
      {paymentMethod === 'cash' && (
        <>
          <div className="mt-2">
            <label className="block text-sm font-medium">Cash Paid:</label>
            <input
              type="number"
              className="w-full p-2 border rounded appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={cashPaid}
              onChange={(e) => {
                const value = e.target.value;
                setCashPaid(value);
                const paid = Number(value) || 0;
                setCashChange(paid - totalPrice);
              }}
              placeholder="Enter amount"
            />
          </div>

          <div className="flex justify-between mt-2 font-bold text-lg">
            <span>Change:</span>
            <span className={cashChange < 0 ? "text-red-500" : "text-green-500"}>
              Rp {cashChange.toLocaleString('id-ID')}
            </span>
          </div>
        </>
      )}

    <div className="mt-6 border-t pt-4 space-y-3">
      <button
        onClick={onCheckout} // <--- Gunakan fungsi baru
        disabled={!canCheckout || (paymentMethod === 'cash' && cashChange < 0)} 
        className={`w-full text-white py-3 rounded-lg mt-4 font-semibold transition ${
          canCheckout && (paymentMethod === 'bank_transfer' || cashChange >= 0)
            ? "bg-green-600 hover:bg-green-700" 
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Process Transaction
      </button>
      <button 
          onClick={handleHoldOrder}
          className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 font-semibold text-sm"
        >
          Hold Order
        </button>
      </div>

      {pendingOrders.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-bold mb-2 text-gray-700 text-sm">Pending Orders:</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {pendingOrders.map(order => (
              <button 
                key={order.id} 
                onClick={() => handleResumeOrder(order)} 
                className="w-full text-left bg-gray-100 hover:bg-gray-200 p-2 rounded text-xs"
              >
                Order #{order.id} - {order.customer_name || 'No Name'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default CartSidebar;