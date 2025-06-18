// src/pages/admin/FoodManagement.jsx (Mobile Responsive)
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAndInitializeFoodItems } from '../../data/mockData';

const FoodManagement = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFoodItems = () => {
      setLoading(true);
      try {
        const allFoodItems = getAndInitializeFoodItems();
        setFoodItems(allFoodItems);
        setFilteredFoodItems(allFoodItems);
      } catch (error) {
        toast.error('Failed to load food items');
        console.error('Error loading food items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFoodItems();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = foodItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFoodItems(filtered);
    } else {
      setFilteredFoodItems(foodItems);
    }
  }, [searchTerm, foodItems]);

  const handleDeleteFood = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;
    
    setDeletingId(id);
    try {
      const updatedFoodItems = foodItems.filter(item => item.id !== id);
      localStorage.setItem('foodItems', JSON.stringify(updatedFoodItems));
      setFoodItems(updatedFoodItems);
      toast.success('Food item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete food item');
      console.error('Error deleting food item:', error);
    } finally {
      setDeletingId(null);
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-0">Food Management</h1>
          <Link
            to="/admin/food-management/add"
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center text-sm sm:text-base"
          >
            <FaPlus className="mr-1 sm:mr-2" /> Add Food Item
          </Link>
        </div>

        <div className="mb-4 sm:mb-6 flex items-center">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search food items..."
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFoodItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
                          <img
                            src={item.image || 'https://via.placeholder.com/64'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/64';
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xxs sm:text-xs text-gray-500 capitalize">{item.category}</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xxs sm:text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status || 'Available'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium space-y-1 sm:space-y-0 sm:space-x-1">
                        <Link
                          to={`/admin/food-management/edit/${item.id}`}
                          className="text-blue-500 hover:text-blue-700 flex items-center text-xxs sm:text-xs"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteFood(item.id)}
                          disabled={deletingId === item.id}
                          className="text-red-500 hover:text-red-700 flex items-center text-xxs sm:text-xs"
                        >
                          {deletingId === item.id ? (
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
            {filteredFoodItems.length === 0 && (
              <div className="p-4 sm:p-6 text-center text-gray-500 text-sm sm:text-base">
                No food items found matching your search
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodManagement;