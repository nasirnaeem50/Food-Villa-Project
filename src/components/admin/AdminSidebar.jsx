// src/components/admin/AdminSidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaTachometerAlt,
  FaUtensils,
  FaClipboardList,
  FaSignOutAlt,
  FaArrowLeft,
  FaBars,
  FaTimes,
  FaUsers,
  FaUserTie,
  FaUserFriends,
  FaUserPlus,
  FaChartLine,
  FaCog,
  FaTags
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminNavLink = ({ to, icon, children, onClick, badge }) => (
  <NavLink
    to={to}
    end={to === "/admin/dashboard"}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-orange-500 text-white font-medium shadow-md'
          : 'text-gray-200 hover:bg-gray-700 hover:text-white'
      }`
    }
  >
    <div className="flex items-center">
      <div className="w-6 flex justify-center">{icon}</div>
      <span className="ml-3">{children}</span>
    </div>
    {badge && (
      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
        {badge}
      </span>
    )}
  </NavLink>
);

const SidebarContent = ({ user, adminMenuItems, handleLogout, onLinkClick }) => (
  <>
    <div className="flex items-center justify-center h-20 border-b border-gray-700/50">
      <Link to="/admin/dashboard" className="flex items-center space-x-2 text-xl font-bold" onClick={onLinkClick}>
        <span className="bg-orange-500 p-2 rounded-lg text-white">🍽️</span>
        <span className="whitespace-nowrap">Food Villa Admin</span>
      </Link>
    </div>

    <nav className="flex-grow p-4 overflow-y-auto">
      <ul className="space-y-2">
        {adminMenuItems.map((item) => (
          <li key={item.name}>
            <AdminNavLink to={item.path} icon={item.icon} badge={item.badge} onClick={onLinkClick}>
              {item.name}
            </AdminNavLink>
          </li>
        ))}
      </ul>
    </nav>

    <div className="p-4 border-t border-gray-700/50">
      <Link 
        to="/" 
        onClick={onLinkClick}
        className="flex items-center w-full px-4 py-3 mb-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
      >
          <div className="w-6 flex justify-center"><FaArrowLeft /></div>
          <span className="ml-3">Back to Site</span>
      </Link>
      
      
        

      <button
        onClick={handleLogout}
        className="flex items-center w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors"
      >
        <div className="w-6 flex justify-center"><FaSignOutAlt /></div>
        <span className="ml-3">Logout</span>
      </button>
    </div>
  </>
);

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [userCount, setUserCount] = useState(0);
  const [foodCount, setFoodCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [promotionCount, setPromotionCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    // Get all counts from localStorage
    const updateCounts = () => {
      try {
        // Update user counts
        const storedUsers = localStorage.getItem('users');
        const allUsers = storedUsers ? JSON.parse(storedUsers) : [];
        
        const adminUsers = allUsers.filter(u => u.role === 'admin' || u.role === 'moderator');
        const staffUsers = allUsers.filter(u => u.role !== 'customer' && u.role !== 'admin' && u.role !== 'moderator');
        const customerUsers = allUsers.filter(u => u.role === 'customer');
        
        setUserCount(adminUsers.length);
        setStaffCount(staffUsers.length);
        setCustomerCount(customerUsers.length);

        // Update food count
        const storedFoods = localStorage.getItem('foodItems');
        const allFoods = storedFoods ? JSON.parse(storedFoods) : [];
        setFoodCount(allFoods.length);

        // Update order count
        const storedOrders = localStorage.getItem('orders');
        const allOrders = storedOrders ? JSON.parse(storedOrders) : [];
        setOrderCount(allOrders.length);

        // Update promotion count
        const storedPromotions = localStorage.getItem('promotions');
        const allPromotions = storedPromotions ? JSON.parse(storedPromotions) : [];
        setPromotionCount(allPromotions.length);
      } catch (error) {
        console.error("Failed to parse data from localStorage", error);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('storage', updateCounts);
    
    // Initial count update
    updateCounts();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('storage', updateCounts);
    };
  }, []);

  const allAdminMenuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt />, roles: ['admin', 'moderator'] },
    { name: 'Food Management', path: '/admin/food-management', icon: <FaUtensils />, badge: foodCount, roles: ['admin', 'moderator'] },
    { name: 'Order Management', path: '/admin/order-management', icon: <FaClipboardList />, badge: orderCount, roles: ['admin', 'moderator'] },
    { name: 'Promotions', path: '/admin/promotions', icon: <FaTags />, badge: promotionCount, roles: ['admin', 'moderator'] },
    { name: 'User Management', path: '/admin/users', icon: <FaUsers />, badge: userCount, roles: ['admin'] },
    { name: 'Staff Members', path: '/admin/staff', icon: <FaUserTie />, badge: staffCount, roles: ['admin'] },
    { name: 'Customers', path: '/admin/customers', icon: <FaUserFriends />, badge: customerCount, roles: ['admin'] },
    { name: 'Analytics', path: '/admin/analytics', icon: <FaChartLine />, roles: ['admin'] },
    { name: 'Settings', path: '/admin/settings', icon: <FaCog />, roles: ['admin'] }
  ];

  const accessibleMenuItems = allAdminMenuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleMobileLinkClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileOpen(false);
  };

  const toggleSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="fixed lg:hidden z-50 top-4 left-4 p-2 rounded-lg bg-orange-500 text-white shadow-lg focus:outline-none"
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Desktop Sidebar - Always visible on large screens */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-gray-800 text-white flex-col shadow-xl z-40">
        <SidebarContent 
          user={user}
          adminMenuItems={accessibleMenuItems}
          handleLogout={handleLogout}
          onLinkClick={() => {}}
        />
      </aside>

      {/* Mobile Sidebar - Animated overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-30 lg:hidden"
              onClick={toggleSidebar}
            />
            
            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed lg:hidden left-0 top-0 h-full w-64 bg-gray-800 text-white flex flex-col shadow-2xl z-40"
            >
              <SidebarContent 
                user={user}
                adminMenuItems={accessibleMenuItems}
                handleLogout={handleLogout}
                onLinkClick={handleMobileLinkClick}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;