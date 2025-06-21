// src/components/AddStaffModal.jsx
import { useState } from 'react';
import { FaTimes, FaUserShield, FaUserTie, FaUtensils, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddStaffModal = ({ isOpen, onClose, onAddStaff }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'chef', // Default role is now 'chef'
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill all required fields');
      setLoading(false);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    onAddStaff(formData);
    setLoading(false);
    onClose();
    // Reset form after submission
    setFormData({ name: '', email: '', role: 'chef', password: '' });
  };

  if (!isOpen) return null;

  const getRoleIcon = (role) => {
    switch(role) {
      // No change to icons, they can stay for potential future use
      case 'admin': return <FaUserShield className="text-red-500" />;
      case 'moderator': return <FaUserTie className="text-blue-500" />;
      case 'chef': return <FaUtensils className="text-orange-500" />;
      case 'waiter': return <FaUser className="text-green-500" />;
      case 'manager': return <FaUserTie className="text-purple-500" />;
      default: return <FaUser className="text-gray-500" />;
    }
  };

  // --- THIS IS THE FIX ---
  // Only allow creation of non-privileged staff roles from this modal
  const roles = [
    { value: 'chef', label: 'Chef' },
    { value: 'waiter', label: 'Waiter' },
    { value: 'manager', label: 'Manager' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl transform transition-all">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add New Staff Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setFormData({...formData, role: role.value})}
                  className={`flex items-center justify-center p-3 border rounded-md transition-colors text-sm font-semibold ${
                    formData.role === role.value 
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {getRoleIcon(role.value)}
                  <span className="ml-2">{role.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password *</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              minLength="6"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-wait transition-colors"
            >
              {loading ? 'Adding...' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;