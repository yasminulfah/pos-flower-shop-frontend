import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import PosPage from './pages/admin/PosPage';
import PrintReceipt from './pages/admin/PrintReceipt';
import OrderHistory from './pages/admin/OrderHistory';
import ProductManagement from './pages/admin/ProductManagement';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './components/MyOrders';
import OrderDetail from './pages/OrderDetail';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />

            {/* Customer */}
            <Route path="/catalog" element={<CustomerLayout><ProductCatalog /></CustomerLayout>} />
            <Route path="/products/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
            <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
            <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
            <Route path="/order-success" element={<CustomerLayout><OrderSuccess /></CustomerLayout>} />
            <Route path="/my-orders" element={<CustomerLayout><MyOrders /></CustomerLayout>} />
            <Route path="/my-orders/:id" element={<CustomerLayout><OrderDetail /></CustomerLayout>} />
            
            {/* Staff */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin', 'owner']}>
                <AdminLayout><Dashboard /></AdminLayout>
              </ProtectedRoute>} />
            <Route path="/admin/pos" element={<AdminLayout><PosPage /></AdminLayout>} />
            <Route path="/admin/print-receipt/:id" element={<PrintReceipt />} />
            <Route path="/admin/order/history" element={<OrderHistory />} />
            <Route path="/admin/products" element={
              <ProtectedRoute allowedRoles={['admin', 'owner']}>
                <AdminLayout><ProductManagement /></AdminLayout>
              </ProtectedRoute>
              } />
          </Routes>
        </Router>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;

