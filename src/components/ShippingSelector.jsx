function ShippingSelector({ shippings, selectedShipping, setSelectedShipping }) {
  return (
    <select
      className="w-full border p-2 rounded"
      value={selectedShipping}
      onChange={(e) => setSelectedShipping(e.target.value)}
      required
    >
      <option value="">Select Shipping</option>
      {Array.isArray(shippings) && shippings.map((s) => (
        <option key={s.id} value={s.id}>
          {s.shipping_method} - Rp {Number(s.base_shipping_cost).toLocaleString('id-ID')}
        </option>
      ))}
    </select>
  );
}
export default ShippingSelector;