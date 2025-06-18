import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, FaShoppingCart, FaBars, FaTimes, FaHome, 
  FaUtensils, FaSearch, FaInfoCircle, FaEnvelope, 
  FaSignInAlt, FaUserShield, FaTachometerAlt 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

// Animation variants (No changes)
const fadeIn = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const UserDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isStaff = user && (user.role === 'admin' || user.role === 'moderator' || user.isAdmin === true);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { setIsOpen(false); }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);
  return (
    <motion.div className="relative" ref={dropdownRef} initial="hidden" animate="visible" variants={fadeIn}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 focus:outline-none px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
        {isStaff ? (
          <FaUserShield className="w-5 h-5 text-purple-600 hover:text-orange-500 dark:text-purple-400 dark:hover:text-orange-400" />
        ) : (
          <FaUser className="w-5 h-5 text-gray-700 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400" />
        )}
        <span className="hidden sm:inline text-gray-700 dark:text-gray-300">{user.name.split(' ')[0]}</span>
      </button>
      {isOpen && (
        <motion.div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {/* --- FIX #1: REMOVED THE DASHBOARD LINK FROM DROPDOWN --- */}
          <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 dark:text-gray-300 dark:hover:bg-gray-700" onClick={() => setIsOpen(false)}>
            Profile
          </Link>
          <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 dark:text-gray-300 dark:hover:bg-gray-700">
            Logout
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

// SearchBar component (No changes)
const SearchBar = ({ isMobile = false, onSearchSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      if (onSearchSubmit) onSearchSubmit();
    }
  };
  return (
    <motion.form onSubmit={handleSearch} className={`${isMobile ? 'w-full px-4 mb-4' : 'hidden md:flex mx-4 transition-all duration-300'} ${isFocused && !isMobile ? 'flex-1' : ''}`} initial="hidden" animate="visible" variants={fadeIn}>
      <div className={`relative w-full transition-all duration-300 ${isFocused && !isMobile ? 'max-w-2xl' : 'max-w-xl'}`}>
        <input ref={searchRef} type="text" placeholder="Search foods..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"/>
        <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400" aria-label="Search">
          <FaSearch className="w-4 h-4" />
        </button>
      </div>
    </motion.form>
  );
};

// --- FIX #2: REDESIGNED THE MOBILE (HAMBURGER) MENU ---
const MobileMenu = ({ isOpen, onClose, user, onLoginClick, onLogout, onSearchSubmit }) => {
  const isStaff = user && (user.role === 'admin' || user.role === 'moderator' || user.isAdmin === true);
  const navItems = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Menu', path: '/menu', icon: <FaUtensils /> },
    { name: 'About', path: '/about', icon: <FaInfoCircle /> },
    { name: 'Contact', path: '/contact', icon: <FaEnvelope /> },
  ];
  return (
    <motion.div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`} initial={{ height: 0, opacity: 0 }} animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
      <div className="pt-2 pb-4 space-y-1">
        <SearchBar isMobile onSearchSubmit={onClose} />
        {navItems.map((item, index) => (
          <motion.div key={item.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + index * 0.05 }}>
            <NavLink to={item.path} end={item.path === '/'} onClick={onClose} className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 text-base font-medium ${ isActive ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
              <div className="w-5">{item.icon}</div>
              <span>{item.name}</span>
            </NavLink>
          </motion.div>
        ))}
        <div className="pt-2 mt-2 border-t mx-4 dark:border-gray-700"></div>
        {isStaff && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Link to="/admin/dashboard" onClick={onClose} className="flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 text-base font-medium text-purple-700 hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-900/50">
                    <div className="w-5"><FaTachometerAlt /></div>
                    <span>Dashboard</span>
                </Link>
            </motion.div>
        )}
        {user ? (
          <>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <Link to="/profile" onClick={onClose} className="flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                 <div className="w-5"><FaUser /></div>
                 <span>Profile</span>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <button onClick={() => { onLogout(); onClose(); }} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 text-left text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                <div className="w-5"><FaSignInAlt className="transform rotate-180" /></div>
                <span>Logout</span>
              </button>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <button onClick={() => { onLoginClick(); onClose(); }} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 text-left text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
              <div className="w-5"><FaSignInAlt /></div>
              <span>Login</span>
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Main Header component (No other changes were made here)
const Header = ({ onLoginClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isStaff = user && (user.role === 'admin' || user.role === 'moderator' || user.isAdmin === true);
  const handleLogout = () => { logout(); navigate('/'); setMobileMenuOpen(false); };
  const handleCartClick = () => { navigate('/cart'); setMobileMenuOpen(false); };
  const handleSearchSubmit = () => setMobileMenuOpen(false);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.header className={`bg-white shadow-sm sticky top-0 z-50 dark:bg-gray-800 dark:shadow-gray-900/20`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div className="flex items-center" initial="hidden" animate="visible" variants={fadeIn}>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mr-2 p-2 text-gray-700 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400 md:hidden" aria-label="Toggle menu">
              {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
            <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
              <motion.div className="bg-orange-500 text-white p-2 rounded-lg dark:bg-orange-600" whileHover={{ scale: 1.05 }}>
                <span className="text-xl font-bold">🍽️</span>
              </motion.div>
              <motion.span className="text-2xl font-bold text-gray-800 dark:text-white" whileHover={{ color: '#f97316' }}>
                Food Villa
              </motion.span>
            </Link>
          </motion.div>
          <motion.div className="hidden md:flex mx-8 flex-1 min-w-0" initial="hidden" animate="visible" variants={fadeIn}>
            <SearchBar onSearchSubmit={handleSearchSubmit} />
          </motion.div>
          <motion.nav className="hidden md:flex items-center space-x-4" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }}}>
             <>
              <motion.div variants={fadeIn}>
                <NavLink to="/" end className={({ isActive }) => `flex items-center space-x-1 px-3 py-2 rounded-lg ${ isActive ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400'}`}>
                  <FaHome className="w-5 h-5" /> <span>Home</span>
                </NavLink>
              </motion.div>
              {['Menu', 'About', 'Contact'].map((item) => (
                <motion.div key={item} variants={fadeIn}>
                  <NavLink to={`/${item.toLowerCase()}`} className={({ isActive }) => `flex items-center space-x-1 px-3 py-2 rounded-lg ${ isActive ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400'}`}>
                    {item === 'Menu' && <FaUtensils className="w-5 h-5" />} {item === 'About' && <FaInfoCircle className="w-5 h-5" />} {item === 'Contact' && <FaEnvelope className="w-5 h-5" />} <span>{item}</span>
                  </NavLink>
                </motion.div>
              ))}
            </>
            {isStaff && (
              <motion.div variants={fadeIn}>
                <NavLink to="/admin/dashboard" className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-900/80">
                  <FaTachometerAlt /><span>Dashboard</span>
                </NavLink>
              </motion.div>
            )}
            {user ? (
              <motion.div variants={fadeIn}>
                <UserDropdown user={user} onLogout={handleLogout} />
              </motion.div>
            ) : (
              <motion.div variants={fadeIn}>
                <button onClick={onLoginClick} className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400 px-3 py-2">
                  <FaSignInAlt className="w-5 h-5" />
                  <span>Login</span>
                </button>
              </motion.div>
            )}
            {!isStaff && (
              <motion.div variants={fadeIn}>
                <button onClick={handleCartClick} className="relative flex items-center space-x-1 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700" aria-label="Cart">
                  <FaShoppingCart className="w-5 h-5" /> <span>Cart</span>
                  {totalItems > 0 && ( <span className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border border-orange-500 dark:bg-orange-100 dark:border-orange-600"> {totalItems > 99 ? '99+' : totalItems} </span> )}
                </button>
              </motion.div>
            )}
          </motion.nav>
          <div className="flex items-center md:hidden">
            {!isStaff && (
              <motion.button onClick={handleCartClick} className="relative p-2 text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500" aria-label={`Cart with ${totalItems} items`} initial="hidden" animate="visible" variants={fadeIn}>
                <FaShoppingCart className="w-6 h-6" />
                {totalItems > 0 && ( <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-gray-800"> {totalItems > 9 ? '9+' : totalItems} </span> )}
              </motion.button>
            )}
          </div>
        </div>
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} user={user} onLoginClick={onLoginClick} onLogout={handleLogout} onSearchSubmit={handleSearchSubmit}/>
      </div>
    </motion.header>
  );
};

export default Header;