// src/pages/admin/PromotionForm.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaCalendarAlt, 
  FaPercent, 
  FaRupeeSign, 
  FaTag, 
  FaUtensils, 
  FaList, 
  FaImage,
  FaSearch,
  FaTimes
} from 'react-icons/fa';
import { getAndInitializeFoodItems } from '../../data/mockData';
import AdminSidebar from '../../components/admin/AdminSidebar';

const PromotionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [promotion, setPromotion] = useState({
    title: '',
    description: '',
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    targetType: 'all',
    targetItems: [],
    targetCategories: [],
    isActive: true,
    image: '/images/promo-placeholder.jpg',
    appliesTo: 'all',
    restaurantId: '1'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const items = getAndInitializeFoodItems();
        setFoodItems(items);
        
        const uniqueCategories = [...new Set(items.map(item => item.category))];
        setCategories(uniqueCategories);

        if (id) {
          const promotions = JSON.parse(localStorage.getItem('promotions') || '[]');
          const existingPromo = promotions.find(p => p.id === id);
          if (existingPromo) {
            setPromotion({
              ...existingPromo,
              image: existingPromo.image || '/images/promo-placeholder.jpg',
              targetItems: existingPromo.targetItems || [],
              targetCategories: existingPromo.targetCategories || []
            });
          }
        }
      } catch (error) {
        toast.error('Failed to load data');
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPromotion(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPromotion(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPromotion(prev => ({
      ...prev,
      image: '/images/promo-placeholder.jpg'
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleItemToggle = (itemId) => {
    setPromotion(prev => {
      const newItems = prev.targetItems.includes(itemId)
        ? prev.targetItems.filter(id => id !== itemId)
        : [...prev.targetItems, itemId];
      return { ...prev, targetItems: newItems };
    });
  };

  const handleCategoryToggle = (category) => {
    setPromotion(prev => {
      const newCategories = prev.targetCategories.includes(category)
        ? prev.targetCategories.filter(c => c !== category)
        : [...prev.targetCategories, category];
      return { ...prev, targetCategories: newCategories };
    });
  };

  const filteredFoodItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const promotions = JSON.parse(localStorage.getItem('promotions') || '[]');
      let updatedPromotions;

      if (id) {
        updatedPromotions = promotions.map(p => 
          p.id === id ? { 
            ...promotion, 
            id,
            image: promotion.image || '/images/promo-placeholder.jpg',
            description: promotion.description || promotion.title,
            targetItems: promotion.targetItems || [],
            targetCategories: promotion.targetCategories || []
          } : p
        );
      } else {
        const newPromo = {
          ...promotion,
          id: `PROMO-${Date.now()}`,
          createdAt: new Date().toISOString(),
          image: promotion.image || '/images/promo-placeholder.jpg',
          description: promotion.description || promotion.title,
          code: promotion.code || '',
          targetItems: promotion.targetItems || [],
          targetCategories: promotion.targetCategories || []
        };
        updatedPromotions = [...promotions, newPromo];
      }

      localStorage.setItem('promotions', JSON.stringify(updatedPromotions));
      toast.success(`Promotion ${id ? 'updated' : 'created'} successfully`);
      navigate('/admin/promotions');
    } catch (error) {
      toast.error(`Failed to ${id ? 'update' : 'create'} promotion`);
    } finally {
      setLoading(false);
    }
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {id ? 'Edit Promotion' : 'Create New Promotion'}
              </h1>
              <button
                onClick={() => navigate('/admin/promotions')}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Image</label>
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-32 h-32 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <img 
                      src={promotion.image} 
                      alt="Promotion" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/promo-placeholder.jpg';
                        e.target.className = 'w-full h-full object-cover';
                      }}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                    >
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                    >
                      Remove Image
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={promotion.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaTag className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="code"
                      value={promotion.code}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      placeholder="SUMMER25"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={promotion.description}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  placeholder="Describe your promotion..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="discountType"
                        value="percentage"
                        checked={promotion.discountType === 'percentage'}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 flex items-center">
                        <FaPercent className="mr-1" /> Percentage
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="discountType"
                        value="fixed"
                        checked={promotion.discountType === 'fixed'}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 flex items-center">
                        <FaRupeeSign className="mr-1" /> Fixed Amount
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {promotion.discountType === 'percentage' ? 'Discount Percentage *' : 'Discount Amount *'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {promotion.discountType === 'percentage' ? (
                        <FaPercent className="text-gray-400" />
                      ) : (
                        <FaRupeeSign className="text-gray-400" />
                      )}
                    </div>
                    <input
                      type="number"
                      name="discountValue"
                      value={promotion.discountValue}
                      onChange={handleChange}
                      min="1"
                      max={promotion.discountType === 'percentage' ? '100' : ''}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="startDate"
                      value={promotion.startDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="endDate"
                      value={promotion.endDate}
                      onChange={handleChange}
                      required
                      min={promotion.startDate}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apply To *</label>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="targetType"
                        value="all"
                        checked={promotion.targetType === 'all'}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2">All Items</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="targetType"
                        value="categories"
                        checked={promotion.targetType === 'categories'}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2">Specific Categories</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="targetType"
                        value="items"
                        checked={promotion.targetType === 'items'}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2">Specific Items</span>
                    </label>
                  </div>

                  {promotion.targetType === 'categories' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FaList className="mr-2" /> Select Categories
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {categories.map(category => (
                          <label key={category} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={promotion.targetCategories.includes(category)}
                              onChange={() => handleCategoryToggle(category)}
                              className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="ml-2">{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {promotion.targetType === 'items' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center">
                          <FaUtensils className="mr-2" /> Select Items
                        </h3>
                        <div className="relative w-48">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Search items..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredFoodItems.length > 0 ? (
                          filteredFoodItems.map(item => (
                            <label key={item.id} className="flex items-center p-2 hover:bg-gray-100 rounded group">
                              <input
                                type="checkbox"
                                checked={promotion.targetItems.includes(item.id)}
                                onChange={() => handleItemToggle(item.id)}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                              />
                              <div className="flex items-center ml-3 flex-1">
                                <img 
                                  src={item.image || '/images/food-placeholder.jpg'} 
                                  alt={item.name}
                                  className="w-10 h-10 rounded object-cover"
                                  onError={(e) => { e.target.src = '/images/food-placeholder.jpg'; }}
                                />
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                  <p className="text-xs text-gray-500">{item.category}</p>
                                </div>
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                PKR {item.price.toLocaleString()}
                              </span>
                            </label>
                          ))
                        ) : (
                          <p className="text-center py-4 text-gray-500">No items found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <label className="flex items-center">
                  <input
                    id="active-checkbox"
                    name="isActive"
                    type="checkbox"
                    checked={promotion.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Active Promotion
                  </span>
                </label>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/promotions')}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : id ? 'Update Promotion' : 'Create Promotion'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionForm;