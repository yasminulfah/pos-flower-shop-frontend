import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import PosPage from './pages/admin/PosPage';
import PrintReceipt from './pages/admin/PrintReceipt';
import OrderHistory from './pages/admin/OrderHistory';
import ProductManagement from './pages/admin/ProductManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/pos" element={<PosPage />} />
        <Route path="/admin/print-receipt/:id" element={<PrintReceipt />} />
        <Route path="/admin/order/history" element={<OrderHistory />} />
        <Route path="/admin/products" element={<ProductManagement />} />
      </Routes>
    </Router>
  );
}

export default App;