import { Link } from 'react-router-dom';
import Logout from '../components/Logout'; 

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-center font-bold text-pink-700 text-xl border-b">
          Uma Bloemist
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/admin/dashboard" className="block p-2 rounded hover:bg-pink-100">Dashboard</Link>
          <Link to="/admin/pos" className="block p-2 rounded hover:bg-pink-100">POS Cashier</Link>
          <Link to="/admin/order/history" className="block p-2 hover:bg-pink-100 rounded">Order History</Link>
          <Link to="/admin/products" className="block p-2 rounded hover:bg-pink-100">Product Management</Link>
          <Logout className="w-full text-left p-2 rounded hover:bg-red-100 text-red-600" />
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Navbar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="font-semibold text-lg text-gray-700">Internal System</h1>
          <div className="text-sm text-gray-500">Welcome, Staff</div>
        </header>
        
        {/* Konten Halaman */}
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;