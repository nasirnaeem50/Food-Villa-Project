// src/pages/admin/CustomerList.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FaSearch, FaTrash, FaEye, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { initialUsers } from '../../data/mockData';


const CustomerList = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const loadAndProcessData = useCallback(() => {
    setLoading(true);
    try {
      const getUsersFromStorage = () => {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) return JSON.parse(storedUsers);
        localStorage.setItem('users', JSON.stringify(initialUsers));
        return initialUsers;
      };
      
      const getCustomerOrderCounts = (usersList) => {
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const counts = {};
        
        // Create a map of all possible user identifiers (id and email)
        const userIdentifiers = new Map();
        usersList.forEach(user => {
          if (user.id) userIdentifiers.set(user.id.toString(), user.id);
          if (user.email) userIdentifiers.set(user.email.toLowerCase(), user.id);
        });
        
        storedOrders.forEach(order => {
          // Check for userId match
          if (order.userId && userIdentifiers.has(order.userId.toString())) {
            const userId = userIdentifiers.get(order.userId.toString());
            counts[userId] = (counts[userId] || 0) + 1;
          }
          // Check for email match in deliveryInfo
          else if (order.deliveryInfo?.email) {
            const emailKey = order.deliveryInfo.email.toLowerCase();
            if (userIdentifiers.has(emailKey)) {
              const userId = userIdentifiers.get(emailKey);
              counts[userId] = (counts[userId] || 0) + 1;
            }
          }
        });
        return counts;
      };

      const users = getUsersFromStorage();
      const orderCounts = getCustomerOrderCounts(users);
      
      const usersWithOrderCount = users.map(user => ({
        ...user,
        orderCount: orderCounts[user.id] || 0,
      }));

      setAllUsers(usersWithOrderCount);
    } catch (error) {
      console.error("Error loading customer data:", error);
      toast.error('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAndProcessData();
    window.addEventListener('focus', loadAndProcessData);
    return () => {
      window.removeEventListener('focus', loadAndProcessData);
    };
  }, [loadAndProcessData]);

  const paginatedCustomers = useMemo(() => {
    let filtered = allUsers.filter(user => user.role === 'customer');

    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        (user.name || '').toLowerCase().includes(lowercasedFilter) ||
        (user.email || '').toLowerCase().includes(lowercasedFilter)
      );
    }
    
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        
        if (typeof valA === 'number' && typeof valB === 'number') {
            return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
        }

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [searchTerm, allUsers, sortConfig, currentPage]);

  const totalFilteredCustomers = useMemo(() => {
      let filtered = allUsers.filter(user => user.role === 'customer');
      if (searchTerm) {
         const lowercasedFilter = searchTerm.toLowerCase();
         filtered = filtered.filter(user =>
            (user.name || '').toLowerCase().includes(lowercasedFilter) ||
            (user.email || '').toLowerCase().includes(lowercasedFilter)
         );
      }
      return filtered.length;
  }, [searchTerm, allUsers]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="inline-block ml-1 text-gray-400" />;
    if (sortConfig.direction === 'ascending') return <FaSortUp className="inline-block ml-1" />;
    return <FaSortDown className="inline-block ml-1" />;
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) return;

    setDeletingId(id);
    setTimeout(() => {
      try {
        const currentUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = currentUsers.filter(user => user.id !== id);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        loadAndProcessData();
        toast.success('Customer deleted successfully!');

      } catch (error) {
        toast.error('Failed to delete customer.');
      } finally {
        setDeletingId(null);
      }
    }, 500);
  };
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

  const totalPages = Math.ceil(totalFilteredCustomers / ITEMS_PER_PAGE);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
          Customer List ({totalFilteredCustomers})
        </h1>

        <div className="mb-6 relative max-w-md">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => requestSort('name')}>
                    Customer {getSortIcon('name')}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => requestSort('orderCount')}>
                    Total Orders {getSortIcon('orderCount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => requestSort('createdAt')}>
                    Joined {getSortIcon('createdAt')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-green-200 rounded-full flex items-center justify-center font-bold text-green-600">
                          {(user.name || "C").charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-700">
                      {user.orderCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                       <Link to={`/admin/order-management?userId=${user.id}`} title="View Orders" className="text-blue-600 hover:text-blue-900">
                         <FaEye />
                       </Link>
                       <button 
                         onClick={() => handleDeleteUser(user.id)}
                         disabled={deletingId === user.id}
                         className="text-red-600 hover:text-red-900 disabled:opacity-50"
                         title="Delete Customer"
                       >
                         {deletingId === user.id ? '...' : <FaTrash />}
                       </button>
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="px-6 py-3 flex items-center justify-between border-t">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerList;