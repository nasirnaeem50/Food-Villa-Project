// src/pages/admin/Settings.jsx
import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FaSave, FaCog, FaInfoCircle, FaPalette, FaLock } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';

const Settings = () => {
  const { settings: globalSettings, updateSettings } = useSettings();
  const [formSettings, setFormSettings] = useState(globalSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormSettings(globalSettings);
  }, [globalSettings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // --- THIS IS THE FIX ---
    // We explicitly convert values from number inputs to the Number type.
    const finalValue = type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value);

    setFormSettings(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    updateSettings(formSettings);
    setSaving(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <FaCog className="text-2xl text-orange-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">System Settings</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-gray-800">
              <div className="flex items-center mb-4">
                <FaInfoCircle className="text-lg text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold dark:text-gray-200">General Settings</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={formSettings.restaurantName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formSettings.currency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="PKR">PKR (₨)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Delivery Fee ({formSettings.currency})
                  </label>
                  <input
                    type="number"
                    name="deliveryFee"
                    value={formSettings.deliveryFee}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Minimum Order Amount ({formSettings.currency})
                  </label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={formSettings.minOrderAmount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-gray-800">
               <div className="flex items-center mb-4">
                <FaPalette className="text-lg text-purple-500 mr-2" />
                <h2 className="text-xl font-semibold dark:text-gray-200">Appearance</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Theme
                  </label>
                  <select
                    name="theme"
                    value={formSettings.theme}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifications"
                    name="notifications"
                    checked={formSettings.notifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Enable Notifications
                  </label>
                </div>
              </div>
            </div>

             <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-gray-800">
               <div className="flex items-center mb-4">
                 <FaLock className="text-lg text-red-500 mr-2" />
                 <h2 className="text-xl font-semibold dark:text-gray-200">System</h2>
               </div>
               <div className="flex items-center">
                 <input
                   type="checkbox"
                   id="maintenanceMode"
                   name="maintenanceMode"
                   checked={formSettings.maintenanceMode}
                   onChange={handleChange}
                   className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                 />
                 <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                   Maintenance Mode
                 </label>
               </div>
               <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                 When enabled, only admins can access the system.
               </p>
             </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Settings;