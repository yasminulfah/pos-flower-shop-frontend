import { useEffect, useState } from 'react';
import api from '../../api/axios';
import AdminLayout from '../../layouts/AdminLayout';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function Dashboard() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todaySales: 0,
    pendingOrders: 0,
    salesGraph: [],
    lowStockProducts: [],
  });
  // State filter 
  const [filterSource, setFilterSource] = useState('online'); 

  useEffect(() => {
    fetchData();
  }, [filterSource]); 

  const fetchData = async () => {
    try {
      const response = await api.get(`/dashboard-stats?source=${filterSource}`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    }
  };

  // Konfigurasi Data Grafik
  const chartData = {
    labels: stats.salesGraph.map(item => item.date),
    datasets: [{
      label: `Daily Sales - ${filterSource.toUpperCase()} (Rp)`,
      data: stats.salesGraph.map(item => item.total),
      borderColor: filterSource === 'online' ? 'rgb(219, 39, 119)' : 'rgb(59, 130, 246)',
      backgroundColor: filterSource === 'online' ? 'rgba(219, 39, 119, 0.5)' : 'rgba(59, 130, 246, 0.5)',
      tension: 0.3
    }]
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
          
          {/* Filter Tipe Pesanan */}
          <select 
            value={filterSource} 
            onChange={(e) => setFilterSource(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Grid Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-pink-500">
            <p className="text-gray-500 uppercase text-sm font-semibold">Today's Orders ({filterSource})</p>
            <p className="text-3xl font-bold text-gray-900">{stats.todayOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <p className="text-gray-500 uppercase text-sm font-semibold">Today's Revenue ({filterSource})</p>
            <p className="text-3xl font-bold text-gray-900">
              Rp {stats.todaySales.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <p className="text-gray-500 uppercase text-sm font-semibold">Pending Orders ({filterSource})</p>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
          </div>
        </div>

        {/* Grafik Penjualan */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Sales Graph (Last 7 Days) - {filterSource.toUpperCase()}</h2>
          <Line data={chartData} />
        </div>

        {/* Alert Stok Rendah */}
        {stats.lowStockProducts.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Low Stock Warning!</h2>
            <ul className="list-disc list-inside text-red-800">
              {stats.lowStockProducts.map(item => (
                <li key={item.id}>
                  {item.product.product_name} - {item.variant_name} : 
                  <span className="font-bold"> {item.stock} left</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default Dashboard;