// src/pages/OrderDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext'; // ADDED
import { toast } from 'react-toastify';
import { FaArrowLeft, FaTrash, FaRegUser, FaHome, FaCreditCard, FaShoppingBag, FaTag } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useSettings(); // ADDED
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const isAdminView = window.location.pathname.includes('/admin/');
  const isStaff = user && (user.role === 'admin' || user.role === 'moderator');

  // MODIFIED: Uses dynamic currency from settings
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return `${settings.currency} 0`;
    return `${settings.currency} ${amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view order details');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = savedOrders.find(o => o.id === id);

      if (!foundOrder) {
        toast.error('Order not found');
        navigate(isAdminView ? '/admin/order-management' : '/profile');
        return;
      }
      
      const isOwner = foundOrder.userId === user.id || foundOrder.deliveryInfo?.email === user.email;
      const canViewOrder = isOwner || isStaff;

      if (!canViewOrder) {
          toast.error('You are not authorized to view this order');
          navigate(isAdminView ? '/admin/order-management' : '/profile');
          return;
      }

      const completeOrder = {
          items: [],
          deliveryInfo: {},
          subtotal: 0,
          deliveryFee: 0,
          tax: 0,
          discount: 0,
          total: 0,
          status: 'Processing',
          ...foundOrder,
      };

      setOrder(completeOrder);
    } catch (error) {
      toast.error('Failed to load order data.');
      console.error('Error loading order:', error);
      navigate(isAdminView ? '/admin/order-management' : '/profile');
    } finally {
      setLoading(false);
    }
  }, [id, user, navigate, isAdminView, isStaff]);

  const handleDeleteOrder = async () => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    setDeleting(true);
    try {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = savedOrders.filter(o => o.id !== id);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      toast.success('Order deleted successfully');
      navigate(isAdminView ? '/admin/order-management' : '/profile');
    } catch (error) {
      toast.error('Failed to delete order');
    } finally {
      setDeleting(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = savedOrders.map(o => o.id === id ? { ...o, status: newStatus } : o );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrder(prev => ({ ...prev, status: newStatus }));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return ( <div className="min-h-screen bg-gray-50 flex items-center justify-center"> <LoadingSpinner size="lg" /> </div> );
  }

  if (!order) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Order not found.</p></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(isAdminView ? '/admin/order-management' : '/profile')} className="flex items-center text-orange-500 hover:text-orange-600">
            <FaArrowLeft className="mr-2" /> Back to {isAdminView ? 'Order Management' : 'Orders'}
          </button>
          {isStaff && ( <div className="flex space-x-2"> <select value={order.status} onChange={(e) => updateOrderStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"> <option value="Processing">Processing</option> <option value="Preparing">Preparing</option> <option value="On the way">On the way</option> <option value="Delivered">Delivered</option> <option value="Cancelled">Cancelled</option> </select> <button onClick={handleDeleteOrder} disabled={deleting} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"> {deleting ? (<>...</>) : (<><FaTrash className="mr-2" /> Delete</>)} </button> </div> )}
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Order #{order.id.split('-')[1] || order.id.slice(-6)}</h1>
                <p className="text-gray-600 mt-1">Placed on {formatDate(order.createdAt)}</p>
                <div className="mt-2"> <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}> {order.status} </span> </div>
              </div>
              <div className="bg-orange-50 px-4 py-3 rounded-lg text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(order.total)}</p>
              </div>
            </div>

            {order.appliedPromo && (
              <div className="bg-green-50 p-4 rounded-lg mb-6 flex items-center">
                <FaTag className="text-green-500 mr-3 text-xl" />
                <div>
                  <p className="font-medium text-green-800">Promo Applied: {order.appliedPromo.title}</p>
                  <p className="text-sm text-green-600">
                    {order.appliedPromo.discountType === 'percentage' 
                      ? `${order.appliedPromo.discountValue}% off` 
                      : `${settings.currency} ${order.appliedPromo.discountValue} off`}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-5 rounded-xl">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><FaRegUser className="w-5 h-5 mr-3 text-orange-500" /> Delivery Information</h2>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-medium text-gray-900">Name:</span> {order.deliveryInfo.name}</p>
                  <p><span className="font-medium text-gray-900">Address:</span> {order.deliveryInfo.address}</p>
                  <p><span className="font-medium text-gray-900">Phone:</span> {order.deliveryInfo.phone}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><FaCreditCard className="w-5 h-5 mr-3 text-orange-500" /> Payment Method</h2>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-gray-900 capitalize">{order.paymentMethod === 'card' ? 'Credit/Debit Card' : order.paymentMethod}</p>
                  <p className="text-gray-600">{order.paymentMethod === 'card' ? 'Paid Online' : 'Pay on Delivery'}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><FaShoppingBag className="w-5 h-5 mr-3 text-orange-500" /> Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <img className="w-16 h-16 rounded-lg object-cover flex-shrink-0" src={item.image} alt={item.name} onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64'; }}/>
                    <div className="flex-1 min-w-0 mx-4">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="ml-4 text-right text-sm font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="max-w-sm ml-auto space-y-3">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span className="font-medium">{formatCurrency(order.subtotal)}</span></div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between"><span className="text-gray-600">Delivery Fee:</span><span className="font-medium">{formatCurrency(order.deliveryFee)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Tax (8%):</span><span className="font-medium">{formatCurrency(order.tax)}</span></div>
                <div className="flex justify-between pt-3 border-t"><span className="text-lg font-bold text-gray-800">Total:</span><span className="text-lg font-bold text-orange-600">{formatCurrency(order.total)}</span></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;