// src/pages/admin/PromotionManagement.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import AdminSidebar from '../../components/admin/AdminSidebar';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPromotions = () => {
      try {
        const storedPromotions = JSON.parse(localStorage.getItem('promotions') || '[]');
        setPromotions(storedPromotions);
        setFilteredPromotions(storedPromotions);
      } catch (error) {
        toast.error('Failed to load promotions');
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = promotions.filter(promo => 
        promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPromotions(filtered);
    } else {
      setFilteredPromotions(promotions);
    }
  }, [searchTerm, promotions]);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) return;
    
    setDeletingId(id);
    try {
      const updatedPromotions = promotions.filter(p => p.id !== id);
      localStorage.setItem('promotions', JSON.stringify(updatedPromotions));
      setPromotions(updatedPromotions);
      toast.success('Promotion deleted successfully');
    } catch (error) {
      toast.error('Failed to delete promotion');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = (id) => {
    const updatedPromotions = promotions.map(promo => 
      promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
    );
    localStorage.setItem('promotions', JSON.stringify(updatedPromotions));
    setPromotions(updatedPromotions);
    toast.success(`Promotion ${updatedPromotions.find(p => p.id === id).isActive ? 'activated' : 'deactivated'}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const isActivePromotion = (promo) => {
    if (!promo.isActive) return false;
    const now = new Date();
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);
    return now >= startDate && now <= endDate;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <div className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-2xl font-bold">Promotion Management</h1>
            <Link
              to="/admin/promotions/add"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center mt-4 sm:mt-0"
            >
              <FaPlus className="mr-2" /> Add Promotion
            </Link>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search promotions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPromotions.map((promo) => (
                    <tr key={promo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{promo.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{promo.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-sm">
                          {promo.code || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium">
                          {promo.discountType === 'percentage' 
                            ? `${promo.discountValue}%` 
                            : `PKR ${promo.discountValue}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button 
                            onClick={() => toggleStatus(promo.id)}
                            className="text-2xl"
                            title={promo.isActive ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                          >
                            {promo.isActive ? (
                              <FaToggleOn className="text-green-500" />
                            ) : (
                              <FaToggleOff className="text-gray-400" />
                            )}
                          </button>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            isActivePromotion(promo) 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {isActivePromotion(promo) ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => navigate(`/admin/promotions/edit/${promo.id}`)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          disabled={deletingId === promo.id}
                          className="text-red-500 hover:text-red-700"
                        >
                          {deletingId === promo.id ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPromotions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No promotions found. Create your first promotion to get started.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionManagement;