import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout'; 
import api from '../../api/axios'; 
import ProductGrid from '../../components/ProductGrid';
import CartSidebar from '../../components/CartSidebar';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, shipRes, packRes, pendingRes] = await Promise.all([
          api.get('/products'),
          api.get('/shippings'), 
          api.get('/packagings'),
          api.get('/orders/pending')
        ]);

        setProducts(prodRes.data.data);
        setShippings(shipRes.data.data); 
        setPackagings(packRes.data.data);
        setPendingOrders(pendingRes.data.data);

      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    fetchData();
  }, []);

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

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty!");
    if (!selectedShipping || !selectedPackaging) return alert("Please select Shipping and Packaging!");

    const checkoutData = {
      items: cart.map(item => ({ product_variant_id: item.variant_id, quantity: item.quantity })),
      customer_name: customerName,
      shipping_id: selectedShipping,
      package_id: selectedPackaging,
      payment_method: 'cash',
      source: 'offline',
      amount_paid: Number(cashPaid) || 0,
      amount_change: cashChange,
      grand_total: totalPrice,
    };

    try {
      const response = await api.post('/order', checkoutData);
      if (response.data.success) {
        alert("Order created: " + response.data.data.order_number);
        window.open(`/admin/print-receipt/${response.data.data.id}`, '_blank');
        requestFormReset();
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
  }

  const handleHoldOrder = async () => {
    if (cart.length === 0) return;

    try {
      const payload = {
        items: cart.map(item => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.price
        })),

        customer_name: customerName,
        shipping_id: selectedShipping,
        package_id: selectedPackaging,
        grand_total: totalPrice
      };
      const response = await api.post('/orders/hold', payload);
      
      setPendingOrders([...pendingOrders, response.data.data]);
      requestFormReset();
      alert("Order ditahan!");
      } catch (error) {
        console.error(error);
        alert("Gagal menahan order.");
    }
  };

  const handleResumeOrder = (order) => {
    setCart(order.items);
    setCustomerName(order.customer_name || '');
    setSelectedShipping(order.shipping_id || '');
    setSelectedPackaging(order.package_id || '');
    setPendingOrders(pendingOrders.filter(o => o.id !== order.id));
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">POS Cashier</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 gap-5">
            <div className="flex flex-col gap-2">
              {/* Tombol Hold */}
              <button onClick={handleHoldOrder} className="w-fit bg-pink-500 text-white p-2 rounded">Hold Order</button>
              {/* Daftar Pending Orders */}
              <div className="mb-4 p-4 border rounded bg-gray-50">
                <h3 className="font-bold mb-2">Pending Orders:</h3>
                <div className="flex flex-wrap gap-2">
                {pendingOrders.map(order => (
                  <button key={order.id} onClick={() => handleResumeOrder(order)} className="bg-gray-200 hover:bg-gray-300 p-2 rounded text-sm">
                    Order #{order.id} - {order.customer_name || 'No Name'}
                  </button>
                ))}
                </div>  
              </div>
            </div>
            <ProductGrid 
            products={products} 
            addToCart={addToCart} />
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
          />
        </div>
      </div>
    </AdminLayout>
  );
}
export default PosPage;