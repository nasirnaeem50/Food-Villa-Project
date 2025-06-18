// src/pages/admin/UserManagement.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FaSearch, FaTrash, FaUserPlus, FaUserShield, FaUserTie } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { initialUsers } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const updateMasterUserList = (updatedUsers) => {
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  };

  const getUsersFromStorage = () => {
    try {
      const storedUsers = localStorage.getItem('users');
      const allUsers = storedUsers ? JSON.parse(storedUsers) : initialUsers;
      if (!storedUsers) {
        updateMasterUserList(initialUsers);
      }
      return allUsers.filter(u => u.role === 'admin' || u.role === 'moderator');
    } catch (error) {
      console.error("Failed to parse users from localStorage", error);
      return initialUsers.filter(u => u.role === 'admin' || u.role === 'moderator');
    }
  };

  useEffect(() => {
    setLoading(true);
    try {
      const allStaff = getUsersFromStorage();
      setStaff(allStaff);
      setFilteredStaff(allStaff);
    } catch (error) {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const results = staff.filter(user => {
      const name = (user.name || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      return name.includes(lowercasedFilter) || email.includes(lowercasedFilter);
    });
    setFilteredStaff(results);
  }, [searchTerm, staff]);
  
  const handleRoleChange = (userId, newRole) => {
    if (userId === currentUser.id) {
      toast.warn("You cannot change your own role.");
      return;
    }
    
    try {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedAllUsers = allUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      );
      
      updateMasterUserList(updatedAllUsers);
      setStaff(getUsersFromStorage());
      toast.success(`User role updated to ${newRole}.`);
    } catch (error) {
      toast.error("Failed to update user's role.");
    }
  };

  const handleDeleteUser = (id) => {
    const userToDelete = staff.find(u => u.id === id);
    if (userToDelete.email === 'nasirnaeem66@gmail.com') {
      toast.error("You cannot delete the main admin account.");
      return;
    }
    if (userToDelete.id === currentUser.id) {
        toast.error("You cannot delete your own account.");
        return;
    }
    if (!window.confirm(`Are you sure you want to delete this user: ${userToDelete.name}?`)) return;
    
    setDeletingId(id);
    setTimeout(() => {
      try {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = allUsers.filter(user => user.id !== id);
        updateMasterUserList(updatedUsers);
        setStaff(prevStaff => prevStaff.filter(s => s.id !== id));
        toast.success('User deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete user.');
      } finally {
        setDeletingId(null);
      }
    }, 500);
  };
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

  const getRoleBadge = (role) => {
    const roles = {
      admin: { icon: <FaUserShield />, text: 'Admin', color: 'bg-red-100 text-red-800' },
      moderator: { icon: <FaUserTie />, text: 'Moderator', color: 'bg-blue-100 text-blue-800' },
      default: { icon: <FaUserTie />, text: 'Unknown', color: 'bg-gray-100 text-gray-800' }
    };
    const { icon, text, color } = roles[role] || roles.default;
    return (
      <span className={`px-2 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${color}`}>
        {icon} {text}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">User Management</h1>
          <Link
            to="/admin/users/add"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow"
          >
            <FaUserPlus /> Add User
          </Link>
        </div>

        <div className="mb-6 relative max-w-md">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                          {(user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{user.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email === 'nasirnaeem66@gmail.com' ? (
                        getRoleBadge(user.role)
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={currentUser.id === user.id}
                          className={`border-gray-300 rounded-md shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm ${currentUser.id === user.id ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleDeleteUser(user.id)} 
                        disabled={deletingId === user.id || user.email === 'nasirnaeem66@gmail.com' || user.id === currentUser.id}
                        className={`text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed`}
                        title="Delete User"
                      >
                        {deletingId === user.id ? '...' : <FaTrash />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;