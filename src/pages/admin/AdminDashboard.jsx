// src/pages/admin/AdminDashboard.jsx (Updated with Mobile Support)
import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Link } from 'react-router-dom';
import { FaEye, FaStore, FaUtensils, FaShoppingCart, FaDollarSign, FaPlus } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAndInitializeFoodItems, restaurants, orders } from '../../data/mockData';

const StatCard = ({ icon, title, value, colorClass }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-all hover:shadow-lg hover:-translate-y-1 ${colorClass.includes('bg-') ? '' : 'border-l-4 ' + colorClass}`}>
    <div className={`p-3 rounded-full ${colorClass.includes('bg-') ? colorClass : 'bg-white'}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalFoodItems: 0,
    restaurantName: '',
    totalOrders: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const allFoodItems = getAndInitializeFoodItems();
        const allRestaurants = restaurants;
        const localStorageOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const allOrders = localStorageOrders.length > 0 ? localStorageOrders : orders;
        
        const validOrders = allOrders.filter(o => o && o.total && !isNaN(o.total) && o.deliveryInfo?.name);
        const revenue = validOrders.reduce((sum, order) => sum + order.total, 0);
        const sortedOrders = [...validOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

        setStats({
          totalFoodItems: allFoodItems.length,
          restaurantName: allRestaurants[0]?.name || 'My Restaurant',
          totalOrders: validOrders.length,
          revenue
        });
        setRecentOrders(sortedOrders);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatCurrency = (amount) => `PKR ${Number(amount).toLocaleString()}`;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <AdminSidebar />
      
      <main className="flex-1 lg:ml-64 p-8">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome, Admin!</h1>
          <p className="text-base md:text-lg text-gray-500 mt-1">Here's a snapshot of your restaurant's performance.</p>
        </header>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            icon={<FaUtensils className="text-white h-6 w-6"/>} 
            title="Total Food Items" 
            value={stats.totalFoodItems} 
            colorClass="bg-blue-500" 
          />
          <StatCard 
            icon={<FaShoppingCart className="text-white h-6 w-6"/>} 
            title="Total Orders" 
            value={stats.totalOrders} 
            colorClass="bg-orange-500" 
          />
          <StatCard 
            icon={<FaDollarSign className="text-white h-6 w-6"/>} 
            title="Total Revenue" 
            value={formatCurrency(stats.revenue)} 
            colorClass="bg-green-500" 
          />
          <StatCard 
            icon={<FaStore className="text-white h-6 w-6"/>} 
            title="Restaurant" 
            value={stats.restaurantName} 
            colorClass="bg-purple-500" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <Link to="/admin/order-management" className="text-sm font-medium text-orange-600 hover:underline">View All</Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No recent orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b-2 border-gray-100">
                    <tr>
                      <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                      <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                      <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                      <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                              {order.deliveryInfo.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{order.deliveryInfo.name}</p>
                              <p className="text-xs text-gray-500">{order.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 whitespace-nowrap font-medium text-gray-700">{formatCurrency(order.total)}</td>
                        <td className="py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                            {order.status || 'Processing'}
                          </span>
                        </td>
                        <td className="py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                        <td className="py-4 whitespace-nowrap text-right">
                          <Link to={`/admin/order-management/${order.id}`} className="text-orange-500 hover:text-orange-700"><FaEye /></Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link to="/admin/food-management/add" className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                <FaPlus className="mr-2"/> Add New Food Item
              </Link>
              <Link to="/admin/food-management" className="w-full flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                <FaUtensils className="mr-2"/> Manage Menu
              </Link>
              <Link to="/admin/order-management" className="w-full flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                <FaShoppingCart className="mr-2"/> View All Orders
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;