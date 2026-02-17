import { Link } from 'react-router-dom'; 
import { useCart } from '../context/CartContext';
import Logout from '../components/Logout'; 

const CustomerLayout = ({ children }) => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navbar */}
      <header className="bg-white shadow-md p-4 sticky top-0 z-50">
        <nav className="mx-10 flex justify-between items-center">
          <Link to="/catalog" className="text-2xl font-bold text-pink-600">
            Uma Bloemist
          </Link>
          <div className="flex gap-4 items-center">
            <Link to="/my-orders" className="text-gray-600 hover:text-pink-600 flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 002-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              <span className="hidden md:inline">My Orders</span>
            </Link>
            
            <Link to="/cart" className="text-gray-700 hover:text-pink-600 font-medium">
              🛒 ({totalItems})
            </Link>
            
            {/* 🛠️ TAMBAHKAN KOMPONEN LOGOUT DI SINI */}
            <Logout className="text-sm text-red-600 hover:text-red-700 font-medium ml-2" />
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto p-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6 mt-10">
        <div className="container mx-auto text-center">
          <p>&copy; 2026 Uma Bloemist. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;