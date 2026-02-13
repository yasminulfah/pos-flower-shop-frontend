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
  handleCheckout,
  updateQuantity
}) {
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

      <div className="border-t pt-4 font-bold text-lg flex justify-between">
        <span>Total</span>
        <span className="text-pink-700">Rp {totalPrice.toLocaleString('id-ID')}</span>
      </div>

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

      <button
        onClick={handleCheckout}
        className="w-full bg-green-600 text-white py-3 rounded-lg mt-4 hover:bg-green-700 font-semibold"
      >
        Process Transaction
      </button>
    </div>
  );
}
export default CartSidebar;