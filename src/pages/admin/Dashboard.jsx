import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function Dashboard() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todaySales: 0,
    pendingOrders: 0,
    salesGraph: [],
    lowStockProducts: [],
    bestSellerProducts: [],
  });
  
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
    // PERBAIKAN: Menambahkan optional chaining (?.) untuk keamanan data
    labels: stats.salesGraph?.map(item => item.date) || [],
    datasets: [{
      label: `Daily Sales - ${filterSource.toUpperCase()} (Rp)`,
      // PERBAIKAN: Menambahkan optional chaining (?.) untuk keamanan data
      data: stats.salesGraph?.map(item => item.total) || [],
      borderColor: filterSource === 'online' ? 'rgb(219, 39, 119)' : 'rgb(59, 130, 246)',
      backgroundColor: filterSource === 'online' ? 'rgba(219, 39, 119, 0.5)' : 'rgba(59, 130, 246, 0.5)',
      tension: 0.3
    }]
  };

  const handleDownload = () => {
    window.open(`http://localhost:8000/api/download-report?source=${filterSource}`, '_blank');
  };

  return (
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
              {/* PERBAIKAN: Menambahkan ?. agar tidak eror jika data belum ada */}
              Rp {stats.todaySales?.toLocaleString('id-ID') || 0}
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

        {/* Laporan Produk Terlaris */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Selling Products ({filterSource})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Product</th>
                    <th className="p-2">Variant</th>
                    <th className="p-2 text-right">Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {/* PERBAIKAN: Menambahkan ?. untuk keamanan */}
                  {stats.bestSellerProducts?.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{item.product_name}</td>
                      <td className="p-2 text-gray-600">{item.variant_name}</td>
                      <td className="p-2 text-right font-bold text-pink-600">{item.total_sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alert Stok Rendah */}
          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-red-500">
            <h2 className="text-xl font-semibold text-red-700 mb-4">Low Stock Warning!</h2>
            {/* PERBAIKAN: Typo sstats -> stats */}
            {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              <ul className="space-y-2 text-red-800">
                {stats.lowStockProducts.map(item => (
                  <li key={item.id} className="flex justify-between bg-red-50 p-2 rounded">
                    {/* PERBAIKAN: Typo Unknow -> Unknown */}
                    <span>{item.product?.product_name || 'Unknown'} - {item.variant_name}</span>
                    <span className="font-bold">{item.stock} left</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-600 font-medium">All products are well stocked.</p>
            )}
          </div>
        </div>
        <button 
            onClick={handleDownload}
            className="bg-pink-600 text-white p-2 px-4 rounded-lg hover:bg-pink-700 flex items-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Excel
        </button>
      </div>
  );
}

export default Dashboard;