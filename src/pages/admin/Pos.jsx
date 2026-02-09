import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../api/axios';

function Pos() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
  }, []);

  //Fungsi untuk menambah barang ke keranjang sementara
  const addToCart = (product, variant) => {
  
    const price = parseFloat(variant.price);

    if (isNaN(price)) {
      console.error("Invalid price!", variant.price);
      return;
    }

    const existingItem = cart.find(
      (item) => item.variant_id === variant.id
    );

    if (existingItem) {
      // Jika barang sudah ada, tambah jumlahnya
      setCart(
        cart.map((item) =>
          item.variant_id === variant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Jika barang baru, masukkan ke keranjang
      setCart([
        ...cart,
        {
          product_id: product.id,
          variant_id: variant.id,
          name: `${product.product_name} - ${variant.variant_name}`,
          price: price,
          quantity: 1,
        },
      ]);
    }
  };

  // Fungsi untuk memperbarui jumlah barang langsung di keranjang
  const updateQuantity = (variantId, change) => {
    setCart(cart.map(item => {
      if (item.variant_id === variantId) {
        const newQuantity = item.quantity + change;
        // Cegah jumlah barang kurang dari 1
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    }));
  };

  // Hitung total harga
  const total = cart.reduce((sum, item) => {
    return sum + Number(item.price) * item.quantity;
  }, 0);

  // Proses Transaksi (Offline/Kasir)
  const handleCheckout = async () => {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const formattedItems = cart.map(item => ({
        product_variant_id: item.variant_id,
        quantity: item.quantity
    }));

    // Data untuk checkout offline
    const checkoutData = {
        items: formattedItems,
        payment_method: 'cash',
        source: 'offline', 
    };

    try {
        const response = await api.post('/order', checkoutData);

        if (response.data.success) {
            alert("Order created successfully! No: " + response.data.data.order_number);
            setCart([]); // Kosongkan keranjang
            
            // --- FITUR CETAK STRUK ---
            // Buka struk di tab baru untuk dicetak
            window.open(`/admin/print-receipt/${response.data.data.id}`, '_blank');
        }
    } catch (error) {
        console.error("Order failed", error);
        alert(error.response?.data?.message || "An error occurred.");
    }
};

  return (
    <AdminLayout>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">POS Cashier</h1>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Kolom Kiri: Produk */}
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Product List</h2>
          <div className="grid grid-cols-3 gap-4">
            {products.map((product) => (
                product.variants.map((variant) => (
                <button
                    key={variant.id}
                    onClick={() => addToCart(product, variant)}
                    className="border p-4 rounded-lg hover:border-pink-500 hover:shadow-lg transition flex flex-col items-center"
                >
                    <img 
                        src={variant.detail_image} 
                        alt={variant.variant_name}
                        className="w-full h-32 object-cover rounded-md mb-2" 
                    />

                    <div className="font-semibold text-center text-sm w-full">
                    {product.product_name} - {variant.variant_name}
                    </div>
                    
                    <p className="text-pink-600 font-bold text-center">
                    Rp {Number(variant.price).toLocaleString('id-ID')}
                    </p>
                    
                    <p className="text-gray-500 text-xs text-center">
                        Stock: {variant.stock}
                    </p>
                </button>
                ))
            ))}
            </div>
        </div>

        {/* Kolom Kanan: Keranjang */}
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
                    {/* Tombol Kurangi Jumlah */}
                    <button 
                        onClick={() => updateQuantity(item.variant_id, -1)}
                        className="bg-gray-200 px-2 py-1 rounded text-xs hover:bg-gray-300"
                    >-</button>
                    
                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                    
                    {/* Tombol Tambah Jumlah */}
                    <button 
                        onClick={() => updateQuantity(item.variant_id, 1)}
                        className="bg-gray-200 px-2 py-1 rounded text-xs hover:bg-gray-300"
                    >+</button>
                </div>
                
                <span className="font-semibold w-24 text-right">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 font-bold text-lg flex justify-between">
            <span>Total</span>
            <span className="text-pink-700">Rp {total.toLocaleString('id-ID')}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white py-3 rounded-lg mt-4 hover:bg-green-700 font-semibold"
          >
            Process Transaction
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Pos;