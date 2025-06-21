// src/pages/admin/OrderManagement.jsx (Mobile Responsive)
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FaSearch, FaEye, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const OrderManagement = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = () => {
      try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        const validOrders = orders.map(order => ({
          id: order.id || 'N/A',
          deliveryInfo: {
            name: order.deliveryInfo?.name || 'No name provided',
            email: order.deliveryInfo?.email || 'No email provided',
            ...order.deliveryInfo
          },
          createdAt: order.createdAt || order.date || new Date().toISOString(),
          status: order.status || 'Processing',
          total: order.total || 0,
          ...order
        }));

        setAllOrders(validOrders);
        setFilteredOrders(validOrders);
      } catch (error) {
        toast.error('Failed to load orders');
        console.error('Error loading orders:', error);
        setAllOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allOrders.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (order.id && order.id.toLowerCase().includes(searchLower)) ||
          (order.deliveryInfo?.name && order.deliveryInfo.name.toLowerCase().includes(searchLower)) ||
          (order.deliveryInfo?.email && order.deliveryInfo.email.toLowerCase().includes(searchLower))
        );
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(allOrders);
    }
  }, [searchTerm, allOrders]);

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    setDeletingId(orderId);
    try {
      const updatedOrders = allOrders.filter(order => order.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setAllOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      toast.success('Order deleted successfully');
    } catch (error) {
      toast.error('Failed to delete order');
      console.error('Error deleting order:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return 'PKR 0';
    return `PKR ${amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <div className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 lg:mb-8">Order Management</h1>
        
        <div className="mb-4 sm:mb-6 flex items-center">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="p-4 sm:p-6 text-center text-gray-500 text-sm sm:text-base">
                No orders found matching your search
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-500">
                            {order.id.substring(0, 8)}...
                          </div>
                          <div className="text-xxs sm:text-xs text-gray-400">
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">
                            {order.deliveryInfo.name}
                          </div>
                          <div className="text-xxs sm:text-xs text-gray-500">
                            {formatCurrency(order.total)}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 sm:py-1 inline-flex text-xxs sm:text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium space-y-1 sm:space-y-0 sm:space-x-1">
                          <Link
                            to={`/admin/order-management/${order.id}`}
                            className="text-orange-500 hover:text-orange-700 flex items-center text-xxs sm:text-xs"
                          >
                            <FaEye className="mr-1" /> View
                          </Link>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={deletingId === order.id}
                            className="text-red-500 hover:text-red-700 flex items-center text-xxs sm:text-xs"
                          >
                            {deletingId === order.id ? (
                              <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <FaTrash className="mr-1" />
                            )}
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;