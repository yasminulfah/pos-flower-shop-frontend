import { useState } from "react";
import { Link } from 'react-router-dom';
import Logout from '../components/Logout'; 

function AdminLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className={`bg-white shadow-md transition-all duration-300 
        ${sidebarOpen ? "w-64" : "w-16"}`}>

        {/* Logo */}
        <div className="p-4 text-center font-bold text-pink-700 text-xl border-b">
          {sidebarOpen ? "Uma Bloemist" : "🌸"}
        </div>

        {/* Menu */}
        <nav className="p-2 space-y-2">

          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 p-2 rounded hover:bg-pink-100"
          >
            📶 {sidebarOpen && "Dashboard"}
          </Link>

          <Link
            to="/admin/pos"
            className="flex items-center gap-2 p-2 rounded hover:bg-pink-100"
          >
            💶 {sidebarOpen && "POS Cashier"}
          </Link>

          <Link
            to="/admin/order/history"
            className="flex items-center gap-2 p-2 rounded hover:bg-pink-100"
          >
            📋 {sidebarOpen && "Order History"}
          </Link>

          <Link
            to="/admin/products"
            className="flex items-center gap-2 p-2 rounded hover:bg-pink-100"
          >
            📝 {sidebarOpen && "Product Management"}
          </Link>

          <Logout
            showText={sidebarOpen}
            className="w-full text-left p-2 rounded hover:bg-red-100 text-red-600"
          />

        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">

            {/* Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-xl p-2 rounded hover:bg-gray-100"
            >
              ☰
            </button>

            <h1 className="font-semibold text-lg text-gray-700">
              Internal System
            </h1>

          </div>

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