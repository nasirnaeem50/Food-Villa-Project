// src/context/SettingsContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const SettingsContext = createContext();

const defaultSettings = {
  theme: 'light',
  notifications: true,
  maintenanceMode: false,
  currency: 'PKR',
  restaurantName: 'Food Villa',
  deliveryFee: 100,
  minOrderAmount: 500,
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('adminSettings');
      const loadedSettings = savedSettings ? JSON.parse(savedSettings) : {};
      
      // --- THIS IS THE FIX ---
      // Sanitize the data on load to ensure correct types.
      // This prevents bugs if old string values are in localStorage.
      const finalSettings = { 
        ...defaultSettings, 
        ...loadedSettings,
        deliveryFee: Number(loadedSettings.deliveryFee) || defaultSettings.deliveryFee,
        minOrderAmount: Number(loadedSettings.minOrderAmount) || defaultSettings.minOrderAmount,
      };

      setSettings(finalSettings);

    } catch (error) {
      console.error('Failed to load settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const updateSettings = useCallback((newSettings) => {
    try {
      setSettings(newSettings);
      localStorage.setItem('adminSettings', JSON.stringify(newSettings));
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    }
  }, []);

  const value = {
    settings,
    updateSettings,
    loading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};