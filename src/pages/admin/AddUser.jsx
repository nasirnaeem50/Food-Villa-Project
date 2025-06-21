// src/pages/admin/AddUser.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FaSave, FaTimes, FaUserShield, FaUserTie } from 'react-icons/fa';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'moderator', // Default to the safer role
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // The roles that can be created from this dedicated page
  const creatableRoles = [
    { value: 'moderator', label: 'Moderator' },
    { value: 'admin', label: 'Admin' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // --- Validation ---
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill all required fields.');
      setLoading(false);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    // --- Logic to Add User ---
    try {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      if (allUsers.some(user => user.email === formData.email)) {
        toast.error("A user with this email already exists.");
        setLoading(false);
        return;
      }

      const newUser = {
        id: `${formData.role}-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        password: formData.password, // In a real app, this should be hashed server-side
        role: formData.role,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...allUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast.success(`User '${newUser.name}' created successfully!`);
      navigate('/admin/users'); // Redirect to the user list

    } catch (error) {
      toast.error('An error occurred while creating the user.');
      console.error(error);
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <FaUserShield className="text-red-500" />;
      case 'moderator': return <FaUserTie className="text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* --- Header --- */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Create New User
            </h1>
            <Link
              to="/admin/users"
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <FaTimes /> Cancel
            </Link>
          </div>

          {/* --- Form Card --- */}
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* --- Full Name --- */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              {/* --- Email --- */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              {/* --- Role Selection --- */}
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {creatableRoles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleRoleSelect(role.value)}
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-200 ${
                        formData.role === role.value
                          ? 'bg-orange-500 text-white border-orange-600 shadow-lg scale-105'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {getRoleIcon(role.value)}
                      <span className="mt-2 font-semibold">{role.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* --- Password --- */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Temporary Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  required
                  minLength="6"
                />
              </div>

              {/* --- Actions --- */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-wait transition-colors shadow-md"
                >
                  <FaSave /> {loading ? 'Creating User...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddUser;