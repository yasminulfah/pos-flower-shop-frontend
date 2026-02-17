import { useState, useEffect } from 'react';
import api from '../../api/axios'; 
import CartSidebar from '../../components/CartSidebar';
import PosProductList from '../../components/PosProductList';

function PosPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [cashPaid, setCashPaid] = useState('');
  const [cashChange, setCashChange] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippings, setShippings] = useState([]);
  const [packagings, setPackagings] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState('');
  const [selectedPackaging, setSelectedPackaging] = useState('');
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, shipRes, packRes, pendingRes] = await Promise.all([
          api.get('/products'),
          api.get('/shippings'), 
          api.get('/packagings'),
          api.get('/orders/pending')
        ]);

        // 🛠️ PERBAIKAN: Mengambil data dari struktur Laravel pagination
        // Jika API menggunakan ->paginate(), datanya ada di .data.data
        // Jika API menggunakan ->get(), datanya ada di .data
        setProducts(prodRes.data.data.data || prodRes.data.data); 
        
        setShippings(shipRes.data.data); 
        setPackagings(packRes.data.data);
        setPendingOrders(pendingRes.data.data);

      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ... fungsi-fungsi lainnya (addToCart, handleCheckout, dll) tetap sama ...
  
  // 🛠️ Pastikan fungsi-fungsi pendukung ada di sini agar kode tidak error
  useEffect(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const shippingCost = shippings.find(s => s.id === Number(selectedShipping))?.base_shipping_cost || 0;
    const packagingCost = packagings.find(p => p.id === Number(selectedPackaging))?.base_packaging_cost || 0;

    const newTotal = subtotal + Number(shippingCost) + Number(packagingCost);
    setTotalPrice(newTotal);

    const paid = Number(cashPaid) || 0;
    setCashChange(paid - newTotal);
  }, [cart, cashPaid, selectedShipping, selectedPackaging, shippings, packagings]);

  const addToCart = (product, variant) => {
    const price = parseFloat(variant.price);
    const existingItem = cart.find((item) => item.variant_id === variant.id);

    if (existingItem) {
      setCart(cart.map((item) =>
        item.variant_id === variant.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, {
        product_id: product.id,
        variant_id: variant.id,
        name: `${product.product_name} - ${variant.variant_name}`,
        price: price,
        quantity: 1,
      }]);
    }
  };

  const updateQuantity = (variantId, change) => {
    setCart(cart.map(item => {
      if (item.variant_id === variantId) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    }));
  };

 const handleCheckout = async (paymentMethod) => {
    if (cart.length === 0) return alert("Cart is empty!");
    if (!selectedShipping || !selectedPackaging) return alert("Please select Shipping and Packaging!");

    // 2. Hitung ulang amount_paid dan amount_change berdasarkan metode pembayaran
    const finalAmountPaid = paymentMethod === 'cash' ? (Number(cashPaid) || 0) : totalPrice;
    const finalAmountChange = paymentMethod === 'cash' ? cashChange : 0;

    const checkoutData = {
      items: cart.map(item => ({ product_variant_id: item.variant_id, quantity: item.quantity })),
      customer_name: customerName,
      shipping_id: selectedShipping,
      package_id: selectedPackaging,
      
      // 3. Gunakan metode pembayaran dari sidebar
      payment_method: paymentMethod, 
      
      // 4. Pastikan source adalah 'offline' untuk transaksi kasir
      source: 'offline', 
      
      amount_paid: finalAmountPaid,
      amount_change: finalAmountChange,
      grand_total: totalPrice,
      order_id: currentOrderId,
    };

    try {
      // 5. PASTIKAN ENDPOINT ADALAH '/checkout' sesuai Controller Laravel
      const response = await api.post('/order', checkoutData);

      if (response.data.success) {
        alert("Order created: " + response.data.data.order_number);
        const orderIdToPrint = response.data.data.id;
        window.open(`/admin/print-receipt/${orderIdToPrint}`, '_blank');

        requestFormReset();

        setPendingOrders(pendingOrders.filter(o => o.id !== currentOrderId));
      }
    } catch (error) {
      alert(error.response?.data?.message || "Order failed.");
    }
};

  const requestFormReset = () => {
    setCart([]);
    setCustomerName('');
    setCashPaid("");
    setCashChange(0);
    setSelectedShipping('');
    setSelectedPackaging('');
    setCurrentOrderId(null);
  }

  const handleHoldOrder = async () => {
    if (cart.length === 0) return;

    try {
      const payload = {
        order_id: currentOrderId,
        items: cart.map(item => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),

        customer_name: customerName,
        shipping_id: selectedShipping,
        package_id: selectedPackaging,
        grand_total: totalPrice
      };

      const response = await api.post('/orders/hold', payload);

      setCurrentOrderId(response.data.data.id);
      
      if (currentOrderId) {
        setPendingOrders(pendingOrders.map(o => o.id === currentOrderId ? response.data.data : o));
      } else {
        setPendingOrders([...pendingOrders, response.data.data]);
      }

      requestFormReset();
      alert("Order ditahan!");
      } catch (error) {
        console.error(error);
        alert("Gagal menahan order.");
    }
  };

  const handleResumeOrder = (order) => {
    setCurrentOrderId(order.id);
    const itemsToMap = order.items || [];

    const formattedItems = itemsToMap.map(item => ({
      product_id: item.product_id,
      variant_id: item.variant_id,
      name: item.name || `${item.product_name} - ${item.variant_name}`, 
      price: Number(item.price),
      quantity: item.quantity,
    }));

    setCart(formattedItems);
    setCustomerName(order.customer_name || '');
    setSelectedShipping(order.shipping_id || '');
    setSelectedPackaging(order.package_id || '');
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">POS Cashier</h1>
      {loading ? (
        <div className="text-center">Loading POS...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 gap-5">
            {/* Komponen Daftar Produk POS */}
            <PosProductList 
              products={products}
              addToCart={addToCart}
              loading={loading}
            />
          </div>

          <div className="md:col-span-1">
            <CartSidebar
              cart={cart}
              customerName={customerName}
              setCustomerName={setCustomerName}
              totalPrice={totalPrice}
              cashPaid={cashPaid}
              setCashPaid={setCashPaid}
              cashChange={cashChange}
              setCashChange={setCashChange}
              shippings={shippings}
              selectedShipping={selectedShipping}
              setSelectedShipping={setSelectedShipping}
              packagings={packagings}
              selectedPackaging={selectedPackaging}
              setSelectedPackaging={setSelectedPackaging}
              handleCheckout={handleCheckout}
              updateQuantity={updateQuantity}
              handleHoldOrder={handleHoldOrder}
              pendingOrders={pendingOrders}
              handleResumeOrder={handleResumeOrder}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default PosPage;