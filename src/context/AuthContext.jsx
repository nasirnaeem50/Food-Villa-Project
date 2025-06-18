// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { initialUsers } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getStoredUsers = () => {
    try {
      const storedUsersRaw = localStorage.getItem('users');
      if (storedUsersRaw) {
        return JSON.parse(storedUsersRaw);
      }
      // If no users, initialize with mock data and return it
      localStorage.setItem('users', JSON.stringify(initialUsers));
      return initialUsers;
    } catch (error) {
      console.error('Failed to parse users data', error);
      return initialUsers;
    }
  };

  // --- NEW (FIX): A robust function to add or update a user in the master list ---
  const addOrUpdateUserInMasterList = (userToSave) => {
    try {
      const allUsers = getStoredUsers();
      const userIndex = allUsers.findIndex(u => u.id === userToSave.id);

      if (userIndex > -1) {
        // Update existing user record (e.g., if role changed)
        allUsers[userIndex] = userToSave;
      } else {
        // Add new user to the list
        allUsers.push(userToSave);
      }
      localStorage.setItem('users', JSON.stringify(allUsers));
    } catch (error) {
      console.error('Failed to update master user list:', error);
    }
  };


  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Failed to parse user data', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const userData = await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Check against staff accounts first
          const staff = {
            'nasirnaeem66@gmail.com': { role: 'admin', name: 'Nasir Naeem (Admin)' },
            'nasirnaeem50@gmail.com': { role: 'moderator', name: 'Nasir Naeem (Moderator)' }
          };
          
          if (staff[email] && password === '123456') {
            const loggedInStaff = {
              id: email === 'nasirnaeem66@gmail.com' ? 'admin-1' : 'mod-1',
              email, 
              name: staff[email].name, 
              token: `mock-${staff[email].role}-token`,
              role: staff[email].role, 
              createdAt: new Date().toISOString(),
            };
            
            // --- THIS IS THE FIX ---
            // Ensure the staff member is in the master user list
            addOrUpdateUserInMasterList(loggedInStaff);

            resolve(loggedInStaff);
            return;
          }

          // Check against registered users
          const allUsers = getStoredUsers();
          const foundUser = allUsers.find(u => u.email === email);
          
          if (foundUser) {
            resolve(foundUser);
          } else {
            reject(new Error('User not found. Please register first.'));
          }
        }, 500);
      });
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Logged in successfully!');
      return userData;
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const userData = await new Promise((resolve, reject) => {
        setTimeout(() => {
          const allUsers = getStoredUsers();
          const userExists = allUsers.some(u => u.email === email);
          
          if (userExists) {
            reject(new Error('User already exists. Please login instead.'));
            return;
          }

          const newUser = {
            id: 'user-' + Date.now().toString(), 
            name, 
            email,
            token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
            role: 'customer', 
            createdAt: new Date().toISOString(),
          };
          
          resolve(newUser);
        }, 500);
      });
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      // --- FIX: Use the new robust function here as well for consistency ---
      addOrUpdateUserInMasterList(userData);
      toast.success('Account created successfully!');
      return userData;
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
  }, []);

  const contextValue = useMemo(() => ({
    user,
    isLoading,
    login,
    logout,
    register
  }), [user, isLoading, login, logout, register]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};