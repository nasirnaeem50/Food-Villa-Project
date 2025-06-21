// src/pages/admin/StaffManagement.jsx
import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FaSearch, FaTrash, FaUserPlus, FaUserShield, FaUserTie, FaUtensils, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { initialUsers } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import AddStaffModal from '../../components/admin/AddStaffModal';

const StaffManagement = () => {
  const { user: currentUser } = useAuth();
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const assignableStaffRoles = ['manager', 'chef', 'waiter'];

  const updateMasterUserList = (updatedUsers) => {
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };
  
  const getStaffFromStorage = () => {
    try {
      const storedUsers = localStorage.getItem('users');
      const allUsers = storedUsers ? JSON.parse(storedUsers) : initialUsers;
      if (!storedUsers) {
        updateMasterUserList(initialUsers);
      }
      // Only include staff roles (exclude admin, moderator, and customer)
      return allUsers.filter(u => 
        assignableStaffRoles.includes(u.role) || 
        (u.role !== 'customer' && u.role !== 'admin' && u.role !== 'moderator')
      );
    } catch (error) {
      console.error("Failed to parse users from localStorage", error);
      return initialUsers.filter(u => 
        assignableStaffRoles.includes(u.role) || 
        (u.role !== 'customer' && u.role !== 'admin' && u.role !== 'moderator')
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    try {
      const allStaff = getStaffFromStorage();
      setStaff(allStaff);
      setFilteredStaff(allStaff);
    } catch (error) {
      toast.error('Failed to load staff members.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const results = staff.filter(user =>
      (user.name || '').toLowerCase().includes(lowercasedFilter) ||
      (user.email || '').toLowerCase().includes(lowercasedFilter)
    );
    setFilteredStaff(results);
  }, [searchTerm, staff]);

  const handleAddStaff = (newStaffData) => {
    try {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const emailExists = allUsers.some(user => user.email === newStaffData.email);

      if (emailExists) {
        toast.error("A user with this email already exists.");
        return;
      }

      const newUser = {
        id: `staff-${Date.now()}`,
        ...newStaffData,
        createdAt: new Date().toISOString(),
      };
      
      const updatedAllUsers = [...allUsers, newUser];
      updateMasterUserList(updatedAllUsers);
      setStaff(getStaffFromStorage()); // Re-fetch to ensure consistency
      toast.success(`Staff member ${newUser.name} added successfully!`);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to add new staff member.");
      console.error(error);
    }
  };

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
      setStaff(getStaffFromStorage());
      toast.success(`User role updated to ${newRole}.`);
    } catch (error) {
      toast.error("Failed to update user's role.");
    }
  };

  const handleDeleteUser = (id) => {
    const userToDelete = staff.find(u => u.id === id);
    if (userToDelete.id === currentUser.id) {
      toast.error("You cannot delete your own account.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${userToDelete.name}?`)) return;
    
    setDeletingId(id);
    setTimeout(() => {
      try {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = allUsers.filter(user => user.id !== id);
        updateMasterUserList(updatedUsers);
        setStaff(prevStaff => prevStaff.filter(s => s.id !== id));
        toast.success('Staff member deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete staff member.');
      } finally {
        setDeletingId(null);
      }
    }, 500);
  };
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

  const getRoleBadge = (role) => {
    const roles = {
      manager: { icon: <FaUserTie />, text: 'Manager', color: 'bg-purple-100 text-purple-800' },
      chef: { icon: <FaUtensils />, text: 'Chef', color: 'bg-orange-100 text-orange-800' },
      waiter: { icon: <FaUser />, text: 'Waiter', color: 'bg-green-100 text-green-800' },
      default: { icon: <FaUser />, text: 'Unknown', color: 'bg-gray-100 text-gray-800' }
    };
    const { icon, text, color } = roles[role] || roles.default;
    return (
      <span className={`px-2 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${color}`}>
        {icon} {text}
      </span>
    );
  };

  return (
    <>
      <AddStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddStaff={handleAddStaff}
        assignableRoles={assignableStaffRoles}
      />
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Staff Management</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow"
            >
              <FaUserPlus /> Add New Staff
            </button>
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
                        {assignableStaffRoles.includes(user.role) ? (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            disabled={currentUser.id === user.id}
                            className={`border-gray-300 rounded-md shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm ${currentUser.id === user.id ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          >
                            {assignableStaffRoles.map(role => (
                              <option key={role} value={role} className="capitalize">{role}</option>
                            ))}
                          </select>
                        ) : (
                          getRoleBadge(user.role)
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                          onClick={() => handleDeleteUser(user.id)} 
                          disabled={deletingId === user.id || user.id === currentUser.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </>
  );
};

export default StaffManagement;