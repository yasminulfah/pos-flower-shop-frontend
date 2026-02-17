import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 🛠️ PERBAIKAN: Terima satu argumen 'item'
  const addToCart = (item) => {
    setCartItems(prev => {
      // Cari berdasarkan variant_id
      const existingItem = prev.find(i => i.variant_id === item.variant_id);
      
      if (existingItem) {
        // Jika ada, update kuantitasnya
        return prev.map(i =>
          i.variant_id === item.variant_id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      
      // Jika belum ada, tambahkan item baru
      return [...prev, item];
    });
  };

  const updateQuantity = (variantId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.variant_id === variantId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (variantId) => {
    setCartItems(prev => prev.filter(item => item.variant_id !== variantId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart, 
      cartSubtotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);