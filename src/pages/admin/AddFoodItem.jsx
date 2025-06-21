import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { toast } from 'react-toastify';
import { getAndInitializeFoodItems } from '../../data/mockData';
import LoadingSpinner from '../../components/LoadingSpinner';

const AddFoodItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const fileInputRef = useRef(null);

  const initialFormState = {
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    restaurantId: 1,
    isVegetarian: false,
    vegan: false,
    spicyLevel: 1,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Peshawari BBQ', 'Peshawari Mains', 'Peshawari Specials', 'Peshawari Rice', 'Peshawari Breads', 'Peshawari Sides', 'Peshawari Street Food', 'Chinese', 'Italian', 'Continental'];

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const allItems = getAndInitializeFoodItems();
      const itemToEdit = allItems.find(item => String(item.id) === String(id));
      if (itemToEdit) {
        setFormData(itemToEdit);
        if (itemToEdit.image) {
          setPreviewImage(itemToEdit.image);
        }
      } else {
        toast.error('Food item not found!');
        navigate('/admin/food-management');
      }
      setLoading(false);
    }
  }, [id, isEditMode, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setPreviewImage(result);
      setFormData(prev => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in Name, Price, and Category.');
      setIsSubmitting(false);
      return;
    }

    try {
      const allFoodItems = getAndInitializeFoodItems();

      const itemToSave = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        spicyLevel: parseInt(formData.spicyLevel) || 0,
        serves: parseInt(formData.serves) || null,
        updatedAt: new Date().toISOString(),
      };

      let updatedFoodItems;
      if (isEditMode) {
        updatedFoodItems = allFoodItems.map(item => String(item.id) === String(id) ? itemToSave : item);
        toast.success('Food item updated successfully!');
      } else {
        const newFoodItem = { ...itemToSave, id: Date.now(), createdAt: new Date().toISOString() };
        updatedFoodItems = [...allFoodItems, newFoodItem];
        toast.success('Food item added successfully!');
      }
      
      localStorage.setItem('foodItems', JSON.stringify(updatedFoodItems));
      navigate('/admin/food-management');
    } catch (error) {
      toast.error('Failed to save food item.');
      console.error("Error saving item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className="flex-1 lg:ml-64 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              {isEditMode ? 'Edit Food Item' : 'Add New Food Item'}
            </h1>
            <p className="text-gray-500 mt-1">
              {isEditMode ? 'Update the details below' : 'Fill in the details to add a new menu item'}
            </p>
          </div>
          <button 
            onClick={() => navigate('/admin/food-management')} 
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Food Management
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && isEditMode ? (
            <div className="flex justify-center p-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="e.g., Chicken Karahi"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rs.</span>
                      <input
                        type="number"
                        name="price"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
                    >
                      <option value="">Select a category</option>
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Serves */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serves (optional)</label>
                    <input
                      type="number"
                      name="serves"
                      min="1"
                      value={formData.serves || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="e.g., 2"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-full sm:w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                      {previewImage ? (
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs text-gray-500 mt-2">No image selected</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 w-full space-y-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload Image
                      </button>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-2 bg-white text-sm text-gray-500">OR</span>
                        </div>
                      </div>
                      <input
                        type="url"
                        name="image"
                        value={formData.image.startsWith('http') ? formData.image : ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="Enter image URL (https://...)"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Describe the food item..."
                  />
                </div>

                {/* Spicy Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spicy Level: <span className="font-bold text-orange-600">{formData.spicyLevel}</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">Mild</span>
                    <input
                      type="range"
                      name="spicyLevel"
                      min="0"
                      max="5"
                      value={formData.spicyLevel}
                      onChange={handleInputChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <span className="text-xs text-gray-500">Hot</span>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { field: 'isVegetarian', label: 'Vegetarian' },
                      { field: 'vegan', label: 'Vegan' },
                      { field: 'bestSeller', label: 'Best Seller' },
                      { field: 'chefSpecial', label: 'Chef Special' },
                      { field: 'yearSpecial', label: 'Year Special' },
                      { field: 'premium', label: 'Premium' }
                    ].map(({ field, label }) => (
                      <label key={field} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name={field}
                          checked={formData[field] || false}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500 transition-colors"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="px-6 py-4 bg-gray-50 text-right">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg font-medium text-white ${isSubmitting ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700'} transition-colors flex items-center justify-center gap-2 w-full sm:w-auto sm:inline-flex`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditMode ? 'Saving...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      {isEditMode ? 'Save Changes' : 'Add Food Item'}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddFoodItem;