import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHistory, FaUser, FaHome, FaUtensils, FaShoppingCart, FaTrash, FaUserShield } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const formatCurrency = (amount) => {
    return `PKR ${amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view your profile');
      navigate('/');
      return;
    }

    const loadOrders = () => {
      try {
        const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
        const userOrders = savedOrders.filter(order => {
          return (
            (order.userId && order.userId === user.id) || 
            (order.deliveryInfo && order.deliveryInfo.email === user.email)
          );
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setOrders(userOrders);
      } catch (error) {
        toast.error('Failed to load orders');
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, navigate]);

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    setDeletingId(orderId);
    try {
      const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
      const updatedOrders = savedOrders.filter(o => o.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(prev => prev.filter(o => o.id !== orderId));
      toast.success('Order deleted successfully');
    } catch (error) {
      toast.error('Failed to delete order');
      console.error('Error deleting order:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            {/* Profile Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className={`h-20 w-20 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                    user.isAdmin ? 'bg-purple-500 dark:bg-purple-600' : 'bg-orange-500 dark:bg-orange-600'
                  }`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {user.name}
                    </h1>
                    {user.isAdmin && (
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate(user.isAdmin ? '/admin/dashboard' : '/')}
                  className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaHome className="text-orange-500 text-xl mb-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user.isAdmin ? 'Dashboard' : 'Home'}
                  </span>
                </button>
                <button
                  onClick={() => navigate(user.isAdmin ? '/admin/food-management' : '/menu')}
                  className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaUtensils className="text-orange-500 text-xl mb-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user.isAdmin ? 'Food Mgmt' : 'Menu'}
                  </span>
                </button>
                {!user.isAdmin && (
                  <button
                    onClick={() => navigate('/cart')}
                    className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FaShoppingCart className="text-orange-500 text-xl mb-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Cart</span>
                  </button>
                )}
                {user.isAdmin && (
                  <button
                    onClick={() => navigate('/admin/order-management')}
                    className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FaHistory className="text-orange-500 text-xl mb-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Orders</span>
                  </button>
                )}
                <button
                  onClick={() => navigate('/profile')}
                  className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {user.isAdmin ? (
                    <FaUserShield className="text-orange-500 text-xl mb-2" />
                  ) : (
                    <FaUser className="text-orange-500 text-xl mb-2" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user.isAdmin ? 'Admin' : 'Profile'}
                  </span>
                </button>
              </div>
            </div>

            {/* Order History */}
            {!user.isAdmin && (
              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                  Order History
                </h2>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="md" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-300">
                      You haven't placed any orders yet.
                    </p>
                    <button
                      onClick={() => navigate('/menu')}
                      className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="cursor-pointer" onClick={() => navigate(`/order/${order.id}`)}>
                            <h3 className="font-medium text-gray-800 dark:text-white">
                              Order #{order.id.split('-')[1] || order.id.slice(-6)}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(order.createdAt)}
                            </p>
                            <p className="text-sm mt-1">
                              Status: <span className={`font-medium ${
                                order.status === 'Delivered' ? 'text-green-500' : 
                                order.status === 'Cancelled' ? 'text-red-500' : 
                                'text-orange-500'
                              }`}>
                                {order.status}
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-orange-500">
                              {formatCurrency(order.total)}
                            </p>
                            <div className="flex space-x-2 mt-1">
                              <button
                                onClick={() => navigate(`/order/${order.id}`)}
                                className="text-sm text-orange-500 hover:text-orange-600"
                              >
                                View Details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteOrder(order.id);
                                }}
                                disabled={deletingId === order.id}
                                className="text-sm text-red-500 hover:text-red-600 flex items-center"
                              >
                                {deletingId === order.id ? (
                                  <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <FaTrash className="inline mr-1" />
                                )}
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 cursor-pointer" onClick={() => navigate(`/order/${order.id}`)}>
                          <h4 className="text-sm font-medium mb-1">Items:</h4>
                          <ul className="text-sm space-y-1">
                            {order.items?.slice(0, 2).map((item) => (
                              <li key={item.id} className="flex items-center">
                                {item.image && (
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-8 h-8 rounded-full object-cover mr-2"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/32';
                                    }}
                                  />
                                )}
                                <span className="truncate max-w-[180px]">{item.name} × {item.quantity}</span>
                              </li>
                            ))}
                            {order.items?.length > 2 && (
                              <li className="text-gray-500">
                                +{order.items.length - 2} more items
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;